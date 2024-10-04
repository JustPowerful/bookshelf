import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FormButton(props: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      type="submit"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-accent  h-9 rounded-md px-3",
        props.className
      )}
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : props.children}
    </Button>
  );
}
