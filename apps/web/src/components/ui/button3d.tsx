import { cn } from "@/lib/utils";
import { Button, ButtonProps, buttonVariants } from "./button";

export default function Button3D(
  props: ButtonProps & { shadowClass?: string; btnClass?: string }
) {
  return (
    <div className={cn("relative group", props.className)}>
      <div
        className={cn(
          "absolute -bottom-1 -right-1 bg-primary opacity-50 rounded-lg w-full h-full",
          props.shadowClass
        )}
      ></div>
      <Button
        {...props}
        className={cn(
          buttonVariants({ variant: "button3d", className: props.className }),
          props.btnClass
        )}
      >
        {props.children}
      </Button>
    </div>
  );
}
