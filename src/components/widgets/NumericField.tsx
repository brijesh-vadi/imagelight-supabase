"use client";

import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NumericFieldProps = Omit<ComponentProps<"input">, "type"> & {
  /**
   * Allow decimal numbers (default: true)
   */
  allowDecimals?: boolean;
};

const NumericField = ({
  allowDecimals = true,
  className,
  onKeyDown,
  step,
  min,
  max,
  ...props
}: NumericFieldProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block scientific notation & signs
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }

    // If decimals are NOT allowed, block decimal point
    if (!allowDecimals && (e.key === "." || e.key === ",")) {
      e.preventDefault();
    }

    onKeyDown?.(e);
  };

  return (
    <Input
      type="number"
      inputMode={allowDecimals ? "decimal" : "numeric"}
      step={step ?? (allowDecimals ? "any" : 1)}
      className={cn(
        "[appearance:textfield]",
        "[&::-webkit-outer-spin-button]:appearance-none",
        "[&::-webkit-inner-spin-button]:appearance-none",
        className,
      )}
      min={min}
      max={max}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
};

export default NumericField;
