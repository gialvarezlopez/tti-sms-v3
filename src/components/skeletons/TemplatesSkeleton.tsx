import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  number?: number;
};

const TemplatesSkeleton = ({ number = 6 }: Props) => {
  return (
    <>
      {Array.from({ length: number }).map((_, index) => (
        <div key={index} className="w-full">
          <div className="border-2 rounded-lg h-full p-4">
            <div className="flex gap-3 justify-between">
              <Skeleton className="h-6 w-2/4 mb-3 animate-pulse" />
              <Skeleton className="h-6 w-1/3 mb-3 rounded-full animate-pulse" />
            </div>

            <div className="">
              <Skeleton className="h-16 w-full mb-3 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TemplatesSkeleton;
