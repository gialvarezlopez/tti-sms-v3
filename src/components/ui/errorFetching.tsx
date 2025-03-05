import { CircleAlert } from "lucide-react";
import React from "react";
type Props = {
  message: string;
};
const ErrorFetching = ({ message }: Props) => {
  return (
    <div className="bg-red-500  text-white formMessageError  rounded relative text-sm  px-3 py-2 inline-flex gap-2 items-center">
      <CircleAlert className="w-4" />
      Error: {message}
    </div>
  );
};

export default ErrorFetching;
