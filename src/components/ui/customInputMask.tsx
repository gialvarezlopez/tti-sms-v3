/*
import React from "react";
import InputMask, { Props as InputMaskProps } from "react-input-mask";
import { Input } from "./input";

interface CustomInputMaskProps extends InputMaskProps {
  className?: string;
  upperCase?: boolean;
}

const CustomInputMask: React.FC<CustomInputMaskProps> = ({
  className,
  mask,
  upperCase,
  onChange,
  ...props
}) => {
  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (upperCase) {
      value = value.toUpperCase();
    }
    if (onChange) {
      onChange({
        ...event,
        target: {
          ...event.target,
          value,
        },
      });
    }
  };

  return (
    <InputMask
      className={className ? className : inputClassName}
      mask={mask}
      onChange={handleInputChange}
      {...props}
    >
      {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
        <Input {...inputProps} />
      )}
    </InputMask>
  );
};

export default CustomInputMask;
*/
import React from "react";
import InputMask, { Props as InputMaskProps } from "react-input-mask";
import { Input } from "./input";

interface CustomInputMaskProps extends InputMaskProps {
  className?: string;
  upperCase?: boolean;
}

const CustomInputMask = React.forwardRef<
  HTMLInputElement,
  CustomInputMaskProps
>(({ className, mask, upperCase, onChange, ...props }, ref) => {
  const inputClassName =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (upperCase) {
      value = value.toUpperCase();
    }
    if (onChange) {
      onChange({
        ...event,
        target: {
          ...event.target,
          value,
        },
      });
    }
  };

  return (
    <InputMask mask={mask} onChange={handleInputChange} {...props}>
      {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
        <Input
          {...inputProps}
          ref={ref} // Asignamos el ref directamente al componente Input
          className={className ? className : inputClassName}
        />
      )}
    </InputMask>
  );
});

CustomInputMask.displayName = "CustomInputMask";

export default CustomInputMask;
