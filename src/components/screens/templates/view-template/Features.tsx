import React from "react";
import { TemplateProps } from "@/types/types";
import { highlightKeyword } from "@/lib/utils/utils";
import { templateType } from "../../../../lib/utils/utils";
import { formatDate } from "@/lib/utils/dateUtils";

type Props = {
  template: TemplateProps;
};

const Features = ({ template }: Props) => {
  // Function to render the dynamic message
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">
            Type of Message:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1">
            {templateType(template?.isTwoWay ?? false)}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">Date created: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {formatDate(template.createdAt ?? "")}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-3">
          <span className="font-normal text-[#1D2433]/60">Template Name: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {template.name}
          </span>
        </div>
        <div className="">
          <span className="font-normal text-[#1D2433]/60">Description: </span>
          <div className="text-[#1D2433] inline-block">
            {template.description}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1   px-6 pt-2 pb-6">
        <span className="font-normal text-[#1D2433]/60">Message: </span>
        <div
          dangerouslySetInnerHTML={{
            __html: highlightKeyword(
              template?.content ?? "",
              template?.keywords?.map(({ keyword, value }) => ({
                keyword,
                value: keyword ?? "",
              })) ?? [],
              "red",
              template?.responses
                ?.filter((item) => item.response && item.reply) // Filter objects that have `response` and `reply`
                .map((item) => ({
                  value: item.response, // Maps only the `response` property
                  color: "black",
                })) ?? [],
              true
            ),
          }}
        />
      </div>
    </>
  );
};

export default Features;
