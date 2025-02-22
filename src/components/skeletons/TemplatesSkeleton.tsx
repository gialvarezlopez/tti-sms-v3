import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TemplatesSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="w-full">
          <div className="border-2 rounded-lg h-full p-4">
            <div className="flex gap-3 justify-between">
              <Skeleton className="h-6 w-2/4 mb-3" />
              <Skeleton className="h-6 w-1/3 mb-3 rounded-full" />
            </div>

            <div className="">
              <Skeleton className="h-16 w-full mb-3" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TemplatesSkeleton;
