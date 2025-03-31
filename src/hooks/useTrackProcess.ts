import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { statsRoutes } from "@/config/apiRoutes";
import { useQuery } from "@tanstack/react-query";

interface FilterParams {
  branches: string[];
  status: string[];
}

const useGetStats = ({ branches, status }: FilterParams) => {
  return useQuery({
    queryKey: ["stats-list", branches, status],
    queryFn: async () => {
      try {
        const url = statsRoutes.get;
        //We use post method due to get method is limited to send parameters
        const { data } = await axiosInstance.post(url, {
          branches,
          status,
        });
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
