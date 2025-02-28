import { toast } from "@/hooks/use-toast";
import { CheckCircle, X } from "lucide-react";
import { TOAST_STATUS } from "./constants";
import { cn } from "./utils";

/**
 * Muestra un mensaje de toast con la configuración proporcionada.
 *
 * @param variant - The type of message (can be one of the TOAST_STATUS values).
 * @param title - The title displayed on the toast.
 * @param description - The additional description or message to display on the toast.
 */
export const showToast = (
  variant: (typeof TOAST_STATUS)[keyof typeof TOAST_STATUS], // We use the constants here
  title: string,
  description: React.ReactNode
) => {
  let icon;
  let backgroundColor;

  // Map custom variants to the variants accepted by toast
  switch (variant) {
    case TOAST_STATUS.SUCCESS:
      icon = <CheckCircle className="h-5 w-5 text-success-v2" />;
      backgroundColor = "bg-success-v1 text-customBlack-v1";
      break;
    case TOAST_STATUS.DESTRUCTIVE:
      icon = <X className="h-5 w-5 text-white" />;
      backgroundColor = "bg-red-500 text-white";
      break;
    case TOAST_STATUS.DEFAULT:
      icon = <X className="h-5 w-5 text-white" />;
      backgroundColor = "bg-blue-500 text-white";
      break;
    default:
      icon = null;
      backgroundColor = "bg-gray-500 text-white";
  }

  // Display the toast with the correct configuration
  toast({
    variant: variant,
    description: (
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <div>{description}</div>
        </div>
      </div>
    ),
    className: cn(
      //`top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 ${backgroundColor}`
      `bottom-4 left-0 md:left-[244px] flex fixed ${backgroundColor} md:max-w-[420px]`
    ),
  });
};
