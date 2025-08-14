import React from "react";

export const useSelectState = (initialValue?: string) => {
  const [value, setValue] = React.useState<string | undefined>(initialValue);
  const [error, setError] = React.useState<string>("");
  
  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (error) setError(""); // Clear error when user makes selection
  };
  
  const validate = (required = false, customValidator?: (value: string | undefined) => string) => {
    if (required && !value) {
      setError("This field is required");
      return false;
    }
    
    if (customValidator && value) {
      const validationError = customValidator(value);
      if (validationError) {
        setError(validationError);
        return false;
      }
    }
    
    setError("");
    return true;
  };
  
  const reset = () => {
    setValue(initialValue);
    setError("");
  };
  
  return {
    value,
    setValue,
    error,
    setError,
    handleValueChange,
    validate,
    reset,
  };
};