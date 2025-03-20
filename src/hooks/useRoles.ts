import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { rolesRoutes } from "@/config/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { PaginateParams } from "@/types/types";

const useGetRoles = ({ page, limit, query }: PaginateParams) => {
  return useQuery({
    queryKey: ["role-list", page, limit, query],
    queryFn: async () => {
      try {
        const params = {
          page,
          limit,
          query,
        };

        const url = rolesRoutes.list;
        const { data } = await axiosInstance.get(url, {
          params,
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

export { useGetRoles };
