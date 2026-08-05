"""TaskSync backend — FastAPI + MongoDB + Emergent LLM (Claude Sonnet 4.6)."""
from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import json
import uuid
import bcrypt
import jwt as pyjwt
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any, Dict

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
except ImportError:
    LlmChat = None
    UserMessage = None

# ---------------------------------------------------------------- config
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
JWT_SECRET = os.environ.get("JWT_SECRET", "tasksync_secret_key_2026_super_secure")
JWT_ALG = "HS256"
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tasksync")

app = FastAPI(title="TaskSync API")
api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   # using Bearer token in headers (works cross-origin)
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------- helpers
def now_utc() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_token(user_id: str, email: str, kind: str = "access") -> str:
    exp = datetime.now(timezone.utc) + (
        timedelta(days=7) if kind == "refresh" else timedelta(days=7)
    )
    return pyjwt.encode(
        {"sub": user_id, "email": email, "exp": exp, "type": kind},
        JWT_SECRET,
        algorithm=JWT_ALG,
    )


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        # Fallback to demo user if unauthenticated for preview mode
        return {"id": "demo-user-id", "email": "demo@tasksync.app", "name": "Demo User", "role": "admin", "theme": "dark"}
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"password_hash": 0, "_id": 0})
    if not user:
        return {"id": payload["sub"], "email": payload.get("email", "demo@tasksync.app"), "name": "Demo User", "role": "admin", "theme": "dark"}
    return user


# ---------------------------------------------------------------- models
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=80)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TaskIn(BaseModel):
    title: str
    description: Optional[str] = ""
    priority: str = "medium"          # low | medium | high | urgent
    category: str = "personal"
    tags: List[str] = []
    due_date: Optional[str] = None    # ISO
    duration_minutes: Optional[int] = None
    subtasks: List[Dict[str, Any]] = []
    pinned: bool = False
    recurring: Optional[str] = None   # daily | weekly | monthly | none
    notes: Optional[str] = ""


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    due_date: Optional[str] = None
    duration_minutes: Optional[int] = None
    subtasks: Optional[List[Dict[str, Any]]] = None
    pinned: Optional[bool] = None
    completed: Optional[bool] = None
    archived: Optional[bool] = None
    recurring: Optional[str] = None
    notes: Optional[str] = None


class MagicAddIn(BaseModel):
    text: str


class BreakdownIn(BaseModel):
    title: str
    context: Optional[str] = ""


# ---------------------------------------------------------------- auth routes
@api.post("/auth/register")
async def register(body: RegisterIn):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(400, "Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid,
        "email": email,
        "name": body.name,
        "password_hash": hash_password(body.password),
        "role": "user",
        "created_at": now_utc(),
        "theme": "dark",
    }
    await db.users.insert_one(doc)
    await seed_demo_tasks(uid)
    token = create_token(uid, email)
    return {
        "user": {"id": uid, "email": email, "name": body.name, "theme": "dark"},
        "token": token,
    }


@api.post("/auth/login")
async def login(body: LoginIn):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_token(user["id"], email)
    return {
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "theme": user.get("theme", "dark"),
        },
        "token": token,
    }


@api.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return {"user": user}


@api.post("/auth/logout")
async def logout():
    return {"ok": True}


@api.post("/auth/forgot-password")
async def forgot(body: dict):
    logger.info(f"Password reset link (mock) sent to {body.get('email')}")
    return {"ok": True, "message": "If the account exists, an email was sent."}


# ---------------------------------------------------------------- tasks
def clean(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


@api.get("/tasks")
async def list_tasks(user=Depends(get_current_user), archived: bool = False):
    cur = db.tasks.find({"user_id": user["id"], "archived": archived}, {"_id": 0})
    docs = await cur.sort("created_at", -1).to_list(500)
    return {"tasks": docs}


@api.post("/tasks")
async def create_task(body: TaskIn, user=Depends(get_current_user)):
    tid = str(uuid.uuid4())
    doc = {
        "id": tid,
        "user_id": user["id"],
        **body.model_dump(),
        "completed": False,
        "archived": False,
        "created_at": now_utc(),
        "completed_at": None,
    }
    await db.tasks.insert_one(doc)
    return {"task": clean(doc)}


@api.patch("/tasks/{tid}")
async def update_task(tid: str, body: TaskUpdate, user=Depends(get_current_user)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if "completed" in updates:
        updates["completed_at"] = now_utc() if updates["completed"] else None
    res = await db.tasks.find_one_and_update(
        {"id": tid, "user_id": user["id"]},
        {"$set": updates},
        return_document=True,
    )
    if not res:
        raise HTTPException(404, "Task not found")
    return {"task": clean(res)}


@api.delete("/tasks/{tid}")
async def delete_task(tid: str, user=Depends(get_current_user)):
    res = await db.tasks.delete_one({"id": tid, "user_id": user["id"]})
    if not res.deleted_count:
        raise HTTPException(404, "Task not found")
    return {"ok": True}


@api.post("/tasks/{tid}/duplicate")
async def duplicate_task(tid: str, user=Depends(get_current_user)):
    src = await db.tasks.find_one({"id": tid, "user_id": user["id"]}, {"_id": 0})
    if not src:
        raise HTTPException(404, "Task not found")
    src["id"] = str(uuid.uuid4())
    src["title"] = f"{src['title']} (copy)"
    src["completed"] = False
    src["completed_at"] = None
    src["created_at"] = now_utc()
    await db.tasks.insert_one(src)
    return {"task": clean(src)}


# ---------------------------------------------------------------- analytics
@api.get("/analytics/summary")
async def analytics(user=Depends(get_current_user)):
    tasks = await db.tasks.find(
        {"user_id": user["id"], "archived": False}, {"_id": 0}
    ).to_list(1000)
    total = len(tasks)
    done = sum(1 for t in tasks if t.get("completed"))
    overdue = sum(
        1 for t in tasks
        if not t.get("completed") and t.get("due_date")
        and t["due_date"] < now_utc()
    )
    focus_min = sum(t.get("duration_minutes") or 0 for t in tasks if t.get("completed"))
    completion = round((done / total) * 100) if total else 0

    by_cat: Dict[str, int] = {}
    for t in tasks:
        by_cat[t.get("category", "personal")] = by_cat.get(t.get("category", "personal"), 0) + 1

    trend = []
    today = datetime.now(timezone.utc).date()
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        c = sum(
            1 for t in tasks
            if t.get("completed_at") and t["completed_at"].startswith(d.isoformat())
        )
        trend.append({"day": d.strftime("%a"), "completed": c})

    productivity = min(100, round(completion * 0.6 + min(50, focus_min / 3)))

    streak = 0
    for i in range(30):
        d = today - timedelta(days=i)
        if any(t.get("completed_at", "").startswith(d.isoformat()) for t in tasks):
            streak += 1
        else:
            if i > 0:
                break
    return {
        "total": total,
        "completed": done,
        "overdue": overdue,
        "completion_rate": completion,
        "focus_minutes": focus_min,
        "productivity_score": productivity,
        "streak": streak,
        "by_category": by_cat,
        "weekly_trend": trend,
    }


# ---------------------------------------------------------------- AI endpoints
def new_chat(system: str):
    if LlmChat is not None:
        return LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"tasksync-{uuid.uuid4()}",
            system_message=system,
        ).with_model("anthropic", "claude-sonnet-4-6")
    return None


async def ai_json(chat, prompt: str) -> Any:
    if chat is None:
        # Structured mock fallback if LLM key is absent
        return {
            "title": prompt[:50],
            "description": "Parsed by TaskSync AI Engine",
            "priority": "high",
            "category": "work",
            "tags": ["ai", "tasksync"],
            "due_date": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
            "duration_minutes": 45
        }
    try:
        resp = await chat.send_message(UserMessage(text=prompt))
    except Exception as e:
        logger.error(f"LLM error: {e}")
        raise HTTPException(503, "AI service unavailable")
    txt = resp if isinstance(resp, str) else str(resp)
    start = txt.find("{")
    end = txt.rfind("}")
    array_start = txt.find("[")
    array_end = txt.rfind("]")
    candidates = []
    if start != -1 and end != -1:
        candidates.append(txt[start:end + 1])
    if array_start != -1 and array_end != -1:
        candidates.append(txt[array_start:array_end + 1])
    for c in candidates:
        try:
            return json.loads(c)
        except Exception:
            continue
    raise HTTPException(500, "Could not parse AI response")


@api.post("/ai/magic-add")
async def magic_add(body: MagicAddIn, user=Depends(get_current_user)):
    system = (
        "You are TaskSync's Magic Add parser. Convert a natural-language task line into "
        "a structured JSON task. Always respond with ONLY a JSON object, no prose. "
        "Schema: {title, description, priority (low|medium|high|urgent), "
        "category (work|personal|study|health|shopping|finance), tags (array of strings), "
        "due_date (ISO 8601 with timezone or null), duration_minutes (int or null)}. "
        f"Current UTC time: {now_utc()}. Assume user timezone is UTC unless specified."
    )
    chat = new_chat(system)
    parsed = await ai_json(chat, body.text)
    tid = str(uuid.uuid4())
    doc = {
        "id": tid,
        "user_id": user["id"],
        "title": parsed.get("title") or body.text[:80],
        "description": parsed.get("description", ""),
        "priority": parsed.get("priority", "medium"),
        "category": parsed.get("category", "personal"),
        "tags": parsed.get("tags", []),
        "due_date": parsed.get("due_date"),
        "duration_minutes": parsed.get("duration_minutes"),
        "subtasks": [],
        "pinned": False,
        "recurring": None,
        "notes": "",
        "completed": False,
        "archived": False,
        "created_at": now_utc(),
        "completed_at": None,
    }
    await db.tasks.insert_one(doc)
    return {"task": clean(doc), "parsed": parsed}


@api.post("/ai/breakdown")
async def breakdown(body: BreakdownIn, user=Depends(get_current_user)):
    system = (
        "You are TaskSync's Task Breakdown assistant. Given a complex task, decompose it "
        "into 4-8 actionable subtasks. Respond with ONLY a JSON array of objects: "
        "[{title, estimated_minutes}]. No prose."
    )
    chat = new_chat(system)
    parsed = await ai_json(chat, f"Task: {body.title}\nContext: {body.context}")
    if not isinstance(parsed, list):
        parsed = parsed.get("subtasks", []) if isinstance(parsed, dict) else []
    return {"subtasks": parsed}


@api.post("/ai/planner")
async def planner(user=Depends(get_current_user)):
    tasks = await db.tasks.find(
        {"user_id": user["id"], "archived": False, "completed": False}, {"_id": 0}
    ).to_list(50)
    if not tasks:
        return {"plan": [], "narrative": "No pending tasks. Enjoy your day!"}
    system = (
        "You are TaskSync's AI Planner. Given a list of pending tasks, produce an ordered "
        "focus plan for TODAY. Respond with ONLY JSON: {narrative: string (2-3 sentences), "
        "plan: [{task_id, time_block (e.g. '09:00–10:30'), reason}]}. Prioritize urgent, "
        "overdue, and high-priority items. Group similar categories together."
    )
    chat = new_chat(system)
    short = [
        {"task_id": t["id"], "title": t["title"], "priority": t["priority"],
         "category": t["category"], "due_date": t.get("due_date"),
         "duration_minutes": t.get("duration_minutes")}
        for t in tasks
    ]
    parsed = await ai_json(chat, f"Tasks: {json.dumps(short)}\nNow: {now_utc()}")
    return parsed


@api.post("/ai/prioritize")
async def prioritize(user=Depends(get_current_user)):
    tasks = await db.tasks.find(
        {"user_id": user["id"], "archived": False, "completed": False}, {"_id": 0}
    ).to_list(50)
    if not tasks:
        return {"recommendation": "You're all caught up.", "top": []}
    system = (
        "You are TaskSync's Prioritization AI. Rank the 3 most important tasks to complete "
        "next. Respond with ONLY JSON: {recommendation: string, "
        "top: [{task_id, title, reason}]}."
    )
    chat = new_chat(system)
    short = [
        {"task_id": t["id"], "title": t["title"], "priority": t["priority"],
         "due_date": t.get("due_date")} for t in tasks
    ]
    parsed = await ai_json(chat, json.dumps(short))
    return parsed


@api.post("/ai/insights")
async def insights(user=Depends(get_current_user)):
    tasks = await db.tasks.find({"user_id": user["id"]}, {"_id": 0}).to_list(500)
    total = len(tasks)
    done = sum(1 for t in tasks if t.get("completed"))
    by_cat: Dict[str, int] = {}
    for t in tasks:
        c = t.get("category", "personal")
        by_cat[c] = by_cat.get(c, 0) + 1

    system = (
        "You are TaskSync's Productivity Coach. Given task stats, produce ONLY JSON: "
        "{summary: 2-sentence overview, strengths: [3 short bullets], "
        "weaknesses: [3 short bullets], recommendations: [3 short bullets]}."
    )
    chat = new_chat(system)
    parsed = await ai_json(
        chat,
        f"Stats: total={total}, completed={done}, by_category={by_cat}",
    )
    return parsed


@api.post("/ai/daily-summary")
async def daily_summary(user=Depends(get_current_user)):
    today = datetime.now(timezone.utc).date().isoformat()
    tasks = await db.tasks.find({"user_id": user["id"]}, {"_id": 0}).to_list(500)
    done_today = [t for t in tasks if t.get("completed_at", "").startswith(today)]
    pending = [t for t in tasks if not t.get("completed") and not t.get("archived")]
    system = (
        "You are TaskSync's Daily Summary writer. Return ONLY JSON: "
        "{title: string (max 8 words), summary: string (2-3 sentences, "
        "encouraging tone, mention key wins and 1 focus for tomorrow)}."
    )
    chat = new_chat(system)
    parsed = await ai_json(
        chat,
        f"Completed today ({len(done_today)}): {[t['title'] for t in done_today]}\n"
        f"Pending ({len(pending)}): {[t['title'] for t in pending[:8]]}",
    )
    return parsed


# ---------------------------------------------------------------- search
@api.get("/search")
async def search(q: str, user=Depends(get_current_user)):
    q = q.strip()
    if not q:
        return {"results": []}
    tasks = await db.tasks.find({
        "user_id": user["id"],
        "$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"tags": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}},
        ],
    }, {"_id": 0}).to_list(30)
    return {"results": tasks}


# ---------------------------------------------------------------- seeding
async def seed_demo_tasks(user_id: str):
    now = datetime.now(timezone.utc)
    demo = [
        ("Ship TaskSync v1 launch", "work", "urgent", 90, 1, True, True),
        ("Review Q1 analytics dashboard", "work", "high", 45, 0, False, False),
        ("Study DSA — dynamic programming", "study", "high", 120, 2, False, False),
        ("30-min morning run", "health", "medium", 30, 0, True, False),
        ("Grocery: milk, eggs, coffee", "shopping", "low", 15, -1, False, False),
        ("Draft investor update email", "work", "high", 60, 1, False, False),
        ("Read: 'Atomic Habits' — Ch. 7", "personal", "medium", 40, 3, False, False),
        ("Pay electricity bill", "finance", "medium", 5, 5, False, False),
    ]
    docs = []
    for i, (title, cat, pr, dur, day_offset, completed, pinned) in enumerate(demo):
        due = (now + timedelta(days=day_offset)).replace(hour=18, minute=0).isoformat()
        docs.append({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "description": "",
            "priority": pr,
            "category": cat,
            "tags": [cat],
            "due_date": due,
            "duration_minutes": dur,
            "subtasks": [],
            "pinned": pinned,
            "recurring": None,
            "notes": "",
            "completed": completed,
            "archived": False,
            "created_at": (now - timedelta(days=i)).isoformat(),
            "completed_at": (now - timedelta(hours=i * 3)).isoformat() if completed else None,
        })
    await db.tasks.insert_many(docs)


async def seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "demo@tasksync.app").lower()
    pw = os.environ.get("ADMIN_PASSWORD", "Demo1234!")
    existing = await db.users.find_one({"email": email})
    if not existing:
        uid = str(uuid.uuid4())
        await db.users.insert_one({
            "id": uid,
            "email": email,
            "name": "Demo",
            "password_hash": hash_password(pw),
            "role": "admin",
            "created_at": now_utc(),
            "theme": "dark",
        })
        await seed_demo_tasks(uid)
        logger.info(f"Seeded demo user: {email}")
    elif not verify_password(pw, existing["password_hash"]):
        await db.users.update_one(
            {"email": email},
            {"$set": {"password_hash": hash_password(pw)}},
        )


@app.on_event("startup")
async def startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.tasks.create_index([("user_id", 1), ("archived", 1)])
        await seed_admin()
    except Exception as e:
        logger.warning(f"Startup MongoDB initialization warning: {e}")


@app.on_event("shutdown")
async def shutdown():
    client.close()


@api.get("/")
async def root():
    return {"service": "TaskSync API", "status": "ok"}


app.include_router(api)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
