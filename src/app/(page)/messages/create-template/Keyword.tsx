import React, { useEffect } from "react";
import InputTypeKeyword from "./InputTypeKeyword";
import { KeywordProps } from "@/types/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";

type Props = {
  setOpenKeyword: React.Dispatch<React.SetStateAction<boolean>>;
  keywordOption: KeywordProps;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
};

const Keyword = ({
  setOpenKeyword,
  keywordOption,
  setMessage,
  message,
}: Props) => {
  const { control } = useFormContext();

  // Configurando useFieldArray
  const { fields, append, remove } = useFieldArray({
    control,
    name: "keywords", // Aquí defines el nombre del campo en el formulario
  });

  useEffect(() => {
    if (keywordOption && keywordOption.name && keywordOption.type) {
      append({ name: keywordOption.name, type: keywordOption.type, value: "" });
    }
  }, [append, keywordOption]);
  return (
    <>
      <div className="flex justify-between gap-3 md:gap-0 pt-6 w-full">
        <div className="flex-1">
          <div className="flex gap-3 items-center flex-1 ju">
            <span className="text-xl font-bold">Keyword</span>
            <span className="flex gap-1 items-center text-customRed-v1">
              <CircleHelp className="w-3" />
              How can I add keyword?
            </span>
          </div>
        </div>
        <Button
          type="button"
          className={`bg-customRed-v3 px-8 min-w-[161px] flex justify-end`}
          variant={"destructive"}
          onClick={() => setOpenKeyword(true)}
        >
          Add Keyword
        </Button>
        <div>{/*<ModalKeyword />*/}</div>
      </div>
      <div className={`w-full ${fields.length > 0 ? "mt-3" : ""}`}>
        <InputTypeKeyword
          fields={fields as KeywordProps[]}
          setMessage={setMessage}
          message={message}
          //keywordOption={keywordOption}
          remove={remove}
        />
      </div>
    </>
  );
};

export default Keyword;
