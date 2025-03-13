import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react"; // Asegúrate de que tienes esta librería instalada para el ícono

type TableSkeletonProps = {
  rows: number; // Número de filas que se quieren simular en el skeleton
  cols: number; // Número de columnas que se quieren simular en el skeleton
  width?: string;
  image?: boolean; // Propiedad opcional para mostrar la columna con un ícono de imagen
  dots?: boolean;
  checkbox?: boolean;
  loading?: boolean;
};

const TableSkeleton = ({
  rows,
  cols,
  width = "w-full",
  image = false, // Por defecto, no se muestra la columna de la imagen
  dots = false,
  checkbox = false,
  loading = false,
}: TableSkeletonProps) => {
  return (
    <div className="overflow-x-auto">
      {loading && (
        <div className="flex justify-start gap-3 items-center pb-1">
          Loading... <Loader2 size={"14px"} className="spin" />
        </div>
      )}

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            {/* Si la propiedad image es true, muestra una columna adicional para la imagen */}
            {checkbox && (
              <th className="p-3 w-8">
                <Skeleton className={`${width} w-4 h-4`} />
              </th>
            )}
            {image && (
              <th className="p-3">
                <Skeleton className={`${width} h-6`} />
              </th>
            )}
            {/* Generar un Skeleton para cada columna del encabezado */}
            {Array(cols)
              .fill(0)
              .map((_, index) => (
                <th key={index} className="p-3">
                  <Skeleton className={`${width} h-6`} />
                </th>
              ))}

            {dots && (
              <th className="p-3">
                <Skeleton className={`${width} h-6 w-6`} />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Generar las filas de la tabla con skeletons */}
          {Array(rows)
            .fill(0)
            .map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {checkbox && (
                  <td className="p-3 w-8">
                    <Skeleton className="w-4 h-4 bg-gray-300" />
                  </td>
                )}
                {/* Si la propiedad image es true, agrega la columna de imagen */}
                {image && (
                  <td className="p-3 w-8">
                    <Skeleton className="w-8 h-8 bg-gray-300 rounded-full" />
                  </td>
                )}
                {/* Generar un Skeleton para cada celda */}
                {Array(cols)
                  .fill(0)
                  .map((_, colIndex) => (
                    <td key={colIndex} className="p-4">
                      <Skeleton className={`${width} h-6`} />
                    </td>
                  ))}

                {dots && (
                  <td className="p-3 w-8 align-middle">
                    <div className="flex flex-col gap-1 justify-center ">
                      <Skeleton className="w-1 h-1 bg-gray-500 rounded-full" />
                      <Skeleton className="w-1 h-1 bg-gray-500 rounded-full" />
                      <Skeleton className="w-1 h-1 bg-gray-500 rounded-full" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
