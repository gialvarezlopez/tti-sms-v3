import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleHelp } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const InfoAddKeyword = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className=" text-customRed-v1 text-sm md:text-base flex gap-1 items-center"
        >
          <CircleHelp className="w-2 md:w-3" />
          How can I add keyword?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] p-0 space-y-1">
        <DialogHeader className="p-4">
          <DialogTitle>How can I add keyword?</DialogTitle>
        </DialogHeader>
        <Separator className="mb-4" />
        <div className="grid gap-4 pb-4 px-4">
          <ol className="list-decimal pl-6 space-y-1">
            <li>
              Write your message and click the{" "}
              <span className="font-bold">{`"Add Keyword"`}</span> button where
              you want to insert a keyword.
            </li>
            <li>
              Fill in the required fields and click{" "}
              <span className="font-bold">Save.</span>
            </li>
            <li>
              The keyword will appear in red and will be displayed below as a
              fillable field.
            </li>
            <li>
              To remove a keyword, click{" "}
              <span className="font-bold">{`"Remove"`}</span>, and it will be
              deleted from the message as well.
            </li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoAddKeyword;
