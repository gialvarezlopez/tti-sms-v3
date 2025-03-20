import React, { useState } from "react";
import Image from "next/image";
import { IconPlus } from "@/assets/images";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SETTING_OPTIONS } from "@/lib/constants";

type Props = {
  setIsNext: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormSelected: React.Dispatch<React.SetStateAction<string>>;
  selectedValue: string;
};
const Add = ({
  setIsNext,
  setIsOpen,
  selectedValue,
  setFormSelected,
}: Props) => {
  const [selectedOption, setSelectionOption] = useState(
    selectedValue === SETTING_OPTIONS.USERS ? "user" : "branch"
  );

  const handleSelectChange = (value: string) => {
    setSelectionOption(value);
  };

  const handleNext = (option: string) => {
    setIsNext(true);
    setFormSelected(option);
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-3 items-center px-6 pt-6 pb-3">
          <Image src={IconPlus} alt="Add" /> Add
        </DialogTitle>
        <Separator className="my-2" />
        <DialogDescription className="px-6  pt-3 text-base text-[#1D2433]/80">
          Select what you want to add.
        </DialogDescription>
      </DialogHeader>
      <div className=" px-6">
        <span className="text-base font-semibold pb-1 block">Add A</span>
        <Select value={selectedOption} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select an option</SelectLabel>
              <SelectItem value="user" bg="#FFF2F2">
                User
              </SelectItem>
              <SelectItem
                value="branch"
                //bg="white"
                bg="#FFF2F2"
              >
                Branch
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-2" />

      <div className="flex gap-3 pb-4 justify-end px-6">
        <Button
          type="button"
          className="btn-white-normal w-full md:w-[33%] semibold"
          variant={"outline"}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-customRed-v3 px-8 w-full md:w-[33%]"
          variant={"destructive"}
          onClick={() => handleNext(selectedOption)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Add;
