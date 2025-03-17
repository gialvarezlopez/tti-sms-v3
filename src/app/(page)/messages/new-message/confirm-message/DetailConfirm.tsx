import React from "react";
import { TYPE_OF_MESSAGE } from "@/lib/constants";
import { convertToSnakeCase, templateType } from "@/lib/utils/utils";
import {
  FormReviewMessageProps,
  TemplateProps,
  TicketsProps,
} from "@/types/types";
import OneAndTwoWay from "./OneAndTwoWay";

type Props = {
  template: TemplateProps;
  formState: FormReviewMessageProps;
};

const DetailConfirm = ({ template, formState }: Props) => {
  // Function to render the dynamic message

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60 text-nowrap">
            Telephone number:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1 ">
            {formState.recipient_number}
          </span>
        </div>

        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">
            Type of message:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1">
            {templateType(template.isTwoWay ?? false)}
          </span>
        </div>
      </div>

      <OneAndTwoWay formState={formState} />

      {/*convertToSnakeCase(templateType(template.isTwoWay ?? false)) ===
        TYPE_OF_MESSAGE.ONE_WAY && <OneWay formState={formState} />*/}
    </>
  );
};

export default DetailConfirm;
