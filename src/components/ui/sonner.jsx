import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#121215] group-[.toaster]:text-[#EDEDED] group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:font-mono group-[.toaster]:text-xs",
          description: "group-[.toast]:text-[#A1A1AA]",
          actionButton:
            "group-[.toast]:bg-[#5E43F3] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[#1A1A1E] group-[.toast]:text-[#A1A1AA]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
