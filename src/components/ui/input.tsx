import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500 dark:focus-visible:ring-offset-gray-900",
          "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500/70 focus-visible:border-blue-500 focus-visible:ring-blue-500 focus-visible:ring-offset-white",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
