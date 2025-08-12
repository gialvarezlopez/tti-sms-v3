import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { usersRoutes } from "@/config/apiRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginateParams, ResetPassword, UserProps } from "@/types/types";
import { showToast } from "@/lib/toastUtil";

interface UserParams extends PaginateParams {
  roles?: string[]; //string[];
}

const useGetUsers = ({ page, per_page, roles, query }: UserParams) => {
  return useQuery({
    queryKey: ["user-list", page, per_page, roles, query],
    queryFn: async () => {
      try {
        const params: UserParams = {
          page,
          per_page,
          query,
          ...(roles?.length && { roles }),
        };

        const url = usersRoutes.list;
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
    //retry: false,
  });
};

const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = usersRoutes.new;
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

const useDeleteMultiplesUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { ids: string[]; operation: string }) => {
      try {
        const url = usersRoutes.multiOption;

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
          `${ids?.length > 1 ? "Users" : "User"} deleted successfully`
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

const useForgotPasswordUser = () => {
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = usersRoutes.forgotPassword;
        const { data } = await axiosInstance.post(url, payload);
        return data; //
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

    onSuccess: (value) => {
      console.log("value.success", value.success);
      let defaultMessage = "Link has been emailed to user";
      let defaultOperation: "success" | "destructive" | "default" = "success";
      let defaultTitle = "Success";

      if (!value.success) {
        defaultOperation = "destructive";
        defaultTitle = "Error!";
        defaultMessage = "Email not found";
      }
      showToast(
        defaultOperation,
        defaultTitle,
        `${value?.message ?? defaultMessage}`
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

const useSetResetPasswordUser = (token: string) => {
  return useMutation({
    mutationFn: async (payload: ResetPassword) => {
      try {
        const url = usersRoutes.resetPassword(token);
        const { data } = await axiosInstance.post(url, payload);
        return data; //
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

    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "There was an problem to reset the password"}`
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
  useGetUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useDeleteMultiplesUsers,
  useForgotPasswordUser,
  useSetResetPasswordUser,
};
