import React from "react";
//import { TYPE_OF_MESSAGE } from "@/lib/constants";
//import { convertToSnakeCase, statusType } from "@/lib/utils";
import { TemplateProps } from "@/types/types";
import { formatTextWithBold } from "@/lib/utils";
//import OneWay from "./OneWay";
//import TwoWay from "./TwoWay";

type Props = {
  //ticket: TicketsProps;
  template: TemplateProps;
};

const Features = ({ template }: Props) => {
  // Function to render the dynamic message

  return (
    <>
      {/*
      <div className="grid grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">Client: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {template.client}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60 text-nowrap">
            Telephone number:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1 ">
            {template.phoneNumber}
          </span>
        </div>
      </div>
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-b border-[#d5d8df]  px-6 py-2">
        {/*
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">Status: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {statusType(template.status)}
          </span>
        </div>
        */}
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">
            Type of message:{" "}
          </span>
          <span className="font-bold text-base text-customBlack-v1">
            {template.type}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="font-normal text-[#1D2433]/60">Date created: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {template.created_at}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1 border-b border-[#d5d8df]  px-6 py-2">
        <div className="flex gap-3">
          <span className="font-normal text-[#1D2433]/60">Template Name: </span>
          <span className="font-bold text-base text-customBlack-v1">
            {template.title}
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
        <div>{formatTextWithBold(template.message ?? "")}</div>
        {/*<span className="">{ticket?.chat[0]?.message}</span>*/}

        {/*
          <div
            dangerouslySetInnerHTML={{
              __html: highlightKeyword(
                renderMessage(),
                template?.keyword || "",
                "black"
              ),
            }}
          />
          */}
      </div>
    </>
  );
};

export default Features;
