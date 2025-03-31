import React from "react";
import { templateType } from "@/lib/utils/utils";
import { FormReviewMessageProps, TemplateProps } from "@/types/types";
import OneAndTwoWay from "./OneAndTwoWay";

type Props = {
  template: TemplateProps;
  formState: FormReviewMessageProps;
};

const DetailConfirm = ({ template, formState }: Props) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60 text-nowrap">
            Telephone Number:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1 ">
            {formState.recipient_number}
          </span>
        </div>

        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">
            Type of Message:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1">
            {templateType(template.isTwoWay ?? false)}
          </span>
        </div>
      </div>

      <OneAndTwoWay formState={formState} />
    </>
  );
};

export default DetailConfirm;
