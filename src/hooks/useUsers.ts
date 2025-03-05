import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { usersRoutes } from "@/config/apiRoutes";
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

const useGetUsers = ({ page, limit, search }: PaginateParams) => {
  return useQuery({
    queryKey: ["user-list", page, limit, search],
    queryFn: async () => {
      try {
        const url = usersRoutes.list;
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

const useCreateUser = () => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = usersRoutes.new;
        const { data } = await axiosInstance.post(url, payload);
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["user-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "User created successfully"}`
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

const useUpdateUser = (id: string) => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = usersRoutes.single(id);
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["user-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "User updated successfully"}`
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

const useDeleteUser = () => {
  const { push } = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const url = usersRoutes.single(id);
        const { data } = await axiosInstance.delete(url);
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["user-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "User deleted successfully"}`
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

export { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser };
