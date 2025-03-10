import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { branchesRoutes } from "@/config/apiRoutes";
import { useRouter } from "next/navigation";
import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PaginateParams, UserProps } from "@/types/types";
import { showToast } from "@/lib/toastUtil";

const useGetBranches = ({ page, limit, search }: PaginateParams) => {
  return useQuery({
    queryKey: ["branch-list", page, limit, search],
    queryFn: async () => {
      try {
        const url = branchesRoutes.list;
        const { data } = await axiosInstance.get(url, {
          params: { page, limit, search },
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

const useCreateBranch = () => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = branchesRoutes.new;
        const { data } = await axiosInstance.post(url, payload);
        return data;
      } catch (e) {
        if (isAxiosError(e) && e.response) {
          const errorMessage =
            e.response.data.message || e.response.data.error || "Unknown error";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["branch-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "Branch created successfully"}`
      );
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.";
      showToast("destructive", "Error!", `${errorMessage}`);
    },
  });
};

const useUpdateBranch = (id: string) => {
  const { push } = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = branchesRoutes.single(id);
        const { data } = await axiosInstance.put(url, payload);
        return data;
      } catch (e) {
        if (isAxiosError(e) && e.response) {
          const errorMessage =
            e.response.data.message || e.response.data.error || "Unknown error";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["branch-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "Branch updated successfully"}`
      );
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.";
      showToast("destructive", "Error!", `${errorMessage}`);
    },
  });
};

const useDeleteBranch = () => {
  const { push } = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const url = branchesRoutes.single(id);
        const { data } = await axiosInstance.delete(url);
        return data; // Asumiendo que `data` ya es el arreglo de clientes
      } catch (e) {
        if (isAxiosError(e) && e.response) {
          // Verificar si el error tiene una respuesta con un mensaje

          const errorMessage =
            e.response.data.message || e.response.data.error || "Unknown error";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["branch-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "Branch deleted successfully"}`
      );
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.";
      showToast("destructive", "Error!", `${errorMessage}`);
    },
  });
};

const useDeleteMultiplesBranches = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { ids: string[]; operation: string }) => {
      try {
        const url = branchesRoutes.multiOption;

        const { data } = await axiosInstance.patch(url, {
          operation: payload.operation,
          ids: payload.ids,
        });
        return data;
      } catch (e) {
        if (isAxiosError(e) && e.response) {
          const errorMessage =
            e.response.data.message || e.response.data.error || "Unknown error";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["branch-list"] }),
    onSuccess: (value, variables) => {
      const { ids } = variables;
      showToast(
        "success",
        "Success!",
        `${
          value?.message ??
          `${ids?.length > 1 ? "Branches" : "Branch"} deleted successfully`
        }`
      );
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.";
      showToast("destructive", "Error!", `${errorMessage}`);
    },
  });
};

export {
  useGetBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
  useDeleteMultiplesBranches,
};
