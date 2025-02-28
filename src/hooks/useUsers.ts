//src/components/hooks/
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { usersRoutes } from "@/config/apiRoutes";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PaginateParams, UserProps } from "@/types/types";

const useGetUsers = ({ page, limit, search }: PaginateParams) => {
  return useQuery({
    queryKey: ["user-list"],
    queryFn: async () => {
      try {
        const url = usersRoutes.list;
        const { data } = await axiosInstance.get(url, {
          params: { page, limit, search },
        });
        return data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          const errorMessage =
            e.response.data.message || e.response.data.error || "Unknown error";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
  });
};

const useCreateUser = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = usersRoutes.new;
        const { data } = await axiosInstance.post(url, payload);
        return data; // Asumiendo que `data` ya es el arreglo de clientes
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
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
      toast({
        variant: "success",
        title: "Success!",
        description: value?.message ?? "User created successfully",
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.";
      toast({
        variant: "destructive",
        title: "Error!",
        description: errorMessage,
      });
    },
  });
};

const useUpdateUser = (id: string) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = usersRoutes.single(id);
        const { data } = await axiosInstance.put(url, payload);
        return data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
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
      toast({
        variant: "success",
        title: "Success!",
        description: value?.message ?? "User updated successfully",
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.";
      toast({
        variant: "destructive",
        title: "Error!",
        description: errorMessage,
      });
    },
  });
};

const useDeleteUser = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const url = usersRoutes.single(id);
        const { data } = await axiosInstance.delete(url);
        return data; // Asumiendo que `data` ya es el arreglo de clientes
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
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
      toast({
        variant: "success",
        title: "Success!",
        description: value?.message ?? "User deleted successfully",
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error has occurred.";
      toast({
        variant: "destructive",
        title: "Error!",
        description: errorMessage,
      });
    },
  });
};

export {
  useGetUsers,
  useCreateUser /*useAuditDeleteMultiple, useAuditSingleProduct*/,
  useUpdateUser,
  useDeleteUser,
};
