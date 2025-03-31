import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { statsRoutes } from "@/config/apiRoutes";
import { useQuery } from "@tanstack/react-query";

interface FilterParams {
  //branches: string[];
  //status: string[];
  status?: string[]; // It can be: 'in_progress', 'overdue', 'toBeOverdue', 'closed', 'error'
  templates?: string[] | null;
  branches?: string[] | null;
  types?: string[]; // It can be: 'oneway' o 'twoway'
  last_sent?: string[]; // Array con dos fechas [start, end]
  last_received?: string[]; // Array con dos fechas [start, end]
}

const useGetStats = ({
  status,
  templates,
  types,
  branches,
  last_sent,
  last_received,
}: FilterParams) => {
  return useQuery({
    queryKey: [
      "stats-list",
      status,
      templates,
      branches,
      last_sent,
      last_received,
      types,
    ],
    queryFn: async () => {
      try {
        // Filters - Only added if they exist
        const params: FilterParams = {
          ...(status?.length && { status }),
          ...(templates?.length && { templates }),
          ...(branches?.length && { branches }),
          ...(last_sent?.length && { last_sent }),
          ...(last_received?.length && { last_received }),
          ...(types?.length && { types }),
        };

        const url = statsRoutes.get;
        //We use post method due to get method is limited to send parameters
        const { data } = await axiosInstance.post(url, params);
        return data;
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response) {
            // Server response error (4xx, 5xx)
            const errorMessage =
              e.response.data.message ||
              e.response.data.error ||
              "Unknown error";
            throw new Error(errorMessage);
          } else if (e.request) {
            // The request was made but no response was received (network problems)
            throw new Error(e.message);
          } else {
            // Other errors (configuration, etc.)
            throw new Error("Error in request configuration");
          }
        } else {
          // Errores no relacionados con Axios
          throw new Error("Unknown error");
        }
      }
    },
  });
};

export { useGetStats };
