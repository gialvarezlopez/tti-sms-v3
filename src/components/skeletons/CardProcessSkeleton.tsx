import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  setClass?: string;
};

const CardProcessSkeleton = ({ setClass }: Props) => {
  return (
    <div className="h-full">
      <Card className={`${setClass} h-full`}>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex justify-between gap-3 items-center">
            {/* Skeleton para el ícono */}
            <Skeleton className="w-[18px] h-[18px] rounded-full" />
            {/* Skeleton para el título */}
            <Skeleton className="w-3/4 h-6" />
          </CardTitle>
        </CardHeader>
        <CardFooter>
          {/* Skeleton para el pie de tarjeta */}
          <Skeleton className="w-1/2 h-8" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardProcessSkeleton;
