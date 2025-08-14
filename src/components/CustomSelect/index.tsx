import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  // Required props
  options: SelectOption[];
  
  // Select behavior
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  
  // Appearance
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  
  // States
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  
  // Styling
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  
  // Size variants
  size?: "sm" | "md" | "lg";
  
  // Additional props
  name?: string;
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option...",
  label,
  description,
  error,
  disabled = false,
  required = false,
  loading = false,
  className,
  triggerClassName,
  contentClassName,
  size = "md",
  name,
  id,
}) => {
  // Generate ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  // Size variants for trigger
  const sizeVariants = {
    sm: "h-8 text-sm",
    md: "h-10",
    lg: "h-12 text-lg",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <Label htmlFor={selectId} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      {/* Description */}
      {description && !error && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {/* Select */}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled || loading}
        name={name}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            sizeVariants[size],
            error && "border-red-500 focus:border-red-500",
            triggerClassName
          )}
        >
          <SelectValue placeholder={loading ? "Loading..." : placeholder} />
        </SelectTrigger>
        
        <SelectContent className={contentClassName}>
          {loading ? (
            <SelectItem value="__loading__" disabled>
              Loading options...
            </SelectItem>
          ) : options.length === 0 ? (
            <SelectItem value="__empty__" disabled>
              No options available
            </SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};