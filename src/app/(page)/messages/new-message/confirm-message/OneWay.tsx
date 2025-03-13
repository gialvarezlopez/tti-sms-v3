import { highlightKeyword, lineReplaceWithBreaks } from "@/lib/utils/utils";
import { FormReviewMessageProps } from "@/types/types";
import React from "react";
type Props = {
  formState: FormReviewMessageProps;
};
const OneWay = ({ formState }: Props) => {
  const renderMessage = () => {
    const content = formState && formState.content ? formState?.content : "";
    const responses =
      formState && formState.content
        ? formState?.responses?.map(({ response, reply }) => ({
            response,
            reply,
          })) ?? []
        : [];

    return { content, responses };
  };

  const { content, responses } = renderMessage();

  // Convert 'responses' to the correct form before passing it to HighlightKeyword
  const formattedResponses = responses.map(({ response, reply }) => ({
    value: response ?? "",
    color: reply ?? "black",
  }));
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
              __html: highlightKeyword(
                content,
                [], //No keywords because already goes inside the content
                "red",
                formattedResponses,
                true //Convert \n into <br>
              ),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OneWay;
