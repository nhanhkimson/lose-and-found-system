import { type LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-sm font-medium text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {required ? <span className="text-danger"> *</span> : null}
    </label>
  );
}
