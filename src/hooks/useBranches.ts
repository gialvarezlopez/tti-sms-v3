//src/components/hooks/
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { branchesRoutes } from "@/config/apiRoutes";
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

const useGetBranches = ({ page, limit, search }: PaginateParams) => {
  return useQuery({
    queryKey: ["branch-list"],
    queryFn: async () => {
      try {
        const url = branchesRoutes.list;
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

const useCreateBranch = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = branchesRoutes.new;
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
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["branch-list"] }),
    onSuccess: (value) => {
      toast({
        variant: "success",
        title: "Success!",
        description: value?.message ?? "Branch created successfully",
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

const useUpdateBranch = (id: string) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = branchesRoutes.single(id);
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
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["branch-list"] }),
    onSuccess: (value) => {
      toast({
        variant: "success",
        title: "Success!",
        description: value?.message ?? "Branch updated successfully",
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

const useDeleteBranch = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const url = branchesRoutes.single(id);
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
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["branch-list"] }),
    onSuccess: (value) => {
      toast({
        variant: "success",
        title: "Success!",
        description: value?.message ?? "Branch deleted successfully",
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
  useGetBranches,
  useCreateBranch /*useAuditDeleteMultiple, useAuditSingleProduct*/,
  useUpdateBranch,
  useDeleteBranch,
};
