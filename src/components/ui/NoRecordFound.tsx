import React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "./button";

type Props = {
  messageNoRecord?: string;
  paramsUrl?: {
    hasParams: boolean;
    paramsToKeep?: string[];
    removeAllParamsFromUrl?: (router: ReturnType<typeof useRouter>) => void;
    removeParamsExcept?: (
      router: ReturnType<typeof useRouter>,
      paramsToKeep: string[]
    ) => void;
  };
  messageFooter?: string;
};
const NoRecordFound = ({
  paramsUrl,
  messageNoRecord,
  messageFooter,
}: Props) => {
  const router = useRouter();
  const handleRemoveParams = () => {
    if (paramsUrl?.removeAllParamsFromUrl) {
      paramsUrl.removeAllParamsFromUrl(router);
    }
  };

  const handleRemoveParamsExcept = () => {
    if (paramsUrl?.removeParamsExcept && paramsUrl.paramsToKeep) {
      paramsUrl.removeParamsExcept(router, paramsUrl.paramsToKeep);
    }
  };

  const message = messageNoRecord ? messageNoRecord : "No records found";
  return (
    <div className="flex flex-col gap-4 items-center justify-between px-4 py-8 mb-4 text-gray-700 bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-300 rounded-lg">
      <span className="bg-gray-300 rounded-full p-2">
        <Search />
      </span>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-6 w-6 text-red-600 animate-bounce" />
        <div>
          <h3 className="text-base font-semibold text-gray-800">Information</h3>
        </div>
      </div>
      <p className="text-sm">{message}</p>
      {paramsUrl?.hasParams && (
        <div className="text-center">
          <Button
            variant={"destructive"}
            className="px-8 tracking-wide font-normal"
            onClick={
              paramsUrl.removeAllParamsFromUrl
                ? handleRemoveParams
                : handleRemoveParamsExcept
            }
          >
            Clear Filter
          </Button>{" "}
          <p className="text-center">or</p>
          <p>
            {messageFooter
              ? messageFooter
              : "Change the parameters in the filter"}
          </p>
        </div>
      )}
    </div>
  );
};

export default NoRecordFound;
