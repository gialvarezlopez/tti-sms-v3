import { FormReviewMessageProps } from "@/types/types";
import React from "react";
type Props = {
  formState: FormReviewMessageProps;
};
const OneWay = ({ formState }: Props) => {
  const renderMessage = () => {
    const message = formState && formState.content ? formState?.content : "";

    return message;
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-3 border-b border-[#CCD1DC]  px-6 py-2">
        <div className="flex gap-3">
          <span className="font-normal text-[#1D2433]/60">Message: </span>
        </div>

        <div>
          <span className="font-normal text-[#1D2433]/60"></span>
          <div
            dangerouslySetInnerHTML={{
              __html: renderMessage(),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OneWay;
