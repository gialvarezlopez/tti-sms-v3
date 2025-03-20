import React, { useEffect } from "react";
import InputTypeKeyword from "./InputTypeKeyword";
import { KeywordProps } from "@/types/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InfoAddKeyword from "./InfoAddKeyword";
import { Separator } from "@/components/ui/separator";

type Props = {
  setOpenKeyword: React.Dispatch<React.SetStateAction<boolean>>;
  keywordOption: KeywordProps;
  maxWidthMainDiv: number;
};

const Keyword = ({ setOpenKeyword, keywordOption, maxWidthMainDiv }: Props) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "keywords",
  });

  useEffect(() => {
    if (keywordOption && keywordOption.keyword && keywordOption.type) {
      append({
        keyword: keywordOption.keyword,
        type: keywordOption.type,
        value: "",
      });
    }
  }, [append, keywordOption]);
  return (
    <>
      <Separator className="mt-6" />
      <div className="flex flex-col">
        <div className="flex justify-between gap-3 md:gap-0 pt-6 w-full flex-col md:flex-row order-2">
          <div className="flex-1">
            <div className="flex gap-3 items-center flex-1">
              <span className="text-base md:text-xl font-bold">Keyword</span>
              <span className="flex gap-1 items-center text-customRed-v1">
                <InfoAddKeyword />
              </span>
            </div>
          </div>
          <Button
            type="button"
            className={`bg-customRed-v3 px-8 min-w-[161px] flex md:justify-end`}
            variant={"destructive"}
            onClick={() => setOpenKeyword(true)}
          >
            Add Keyword
          </Button>
        </div>
        <div
          className={`w-full ${
            fields.length > 0 ? "mt-3" : ""
          } order-1 md:order-2`}
        >
          <InputTypeKeyword
            fields={fields as KeywordProps[]}
            remove={remove}
            maxWidthMainDiv={maxWidthMainDiv}
          />
        </div>
      </div>
    </>
  );
};

export default Keyword;
