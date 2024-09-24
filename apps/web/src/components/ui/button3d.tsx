import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./button";

export default function Button3D({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute -bottom-1 -right-1 bg-primary opacity-50 rounded-lg w-full h-full"></div>
      <Button
        className={cn(buttonVariants({ variant: "button3d", className }))}
      >
        {children}
      </Button>
    </div>
  );
}
