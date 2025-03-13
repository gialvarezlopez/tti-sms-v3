import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { statsRoutes } from "@/config/apiRoutes";
import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PaginateParams, UserProps } from "@/types/types";

interface FilterParams {
  branches: string[];
  status: string;
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
            throw new Error("Network error: Could not connect to the server");
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
    //retry: false,
  });
};

export { useGetStats };
