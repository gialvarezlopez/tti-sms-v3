import { FormMessage as OriginalFormMessage } from "@/components/ui/form";

// Create a new component that uses the original FormMessage and adds the classes you want
interface CustomFormMessageProps
  extends React.ComponentProps<typeof OriginalFormMessage> {
  showIcon?: boolean;
}

const CustomFormMessage = ({
  showIcon = true,
  className = "",
  ...props
}: CustomFormMessageProps) => {
  return (
    <OriginalFormMessage
      className={`bg-customRed-v4  text-[#1D2433] formMessageError  rounded relative text-xs inline-block ${
        showIcon ? "showIconError" : ""
      } ${className}`}
      {...props}
    />
  );
};

export default CustomFormMessage;
