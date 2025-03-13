import React from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type Props = {
  title: string;
  footer: string;
  icon?: string;
  setClass?: string;
};

const CardProcess = ({ title, footer, icon, setClass }: Props) => {
  return (
    <div className="h-full group hover:transition-all hover:duration-300 ">
      <Card className={`${setClass} h-full flex flex-col justify-between`}>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex justify-between gap-3 items-center">
            <Image src={icon || ""} alt={title} className="w-[18px] h-[18px]" />{" "}
            {title}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <h3 className="font-bold text-2xl transition-transform duration-300 transform group-hover:translate-y-[-4px]">
            {footer}
          </h3>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardProcess;
