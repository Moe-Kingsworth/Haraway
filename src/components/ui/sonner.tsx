import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-card text-foreground border-border shadow-soft",
        },
      }}
    />
  );
}

export { Toaster };
