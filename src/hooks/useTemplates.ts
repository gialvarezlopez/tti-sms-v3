//src/components/hooks/
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { templatesRoutes } from "@/config/apiRoutes";
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
import { showToast } from "@/lib/toastUtil";

const returnAfterSubmit = "/messages/templates";

const useGetTemplates = ({ page, limit, search }: PaginateParams) => {
  return useQuery({
    queryKey: ["template-list"],
    queryFn: async () => {
      try {
        const url = templatesRoutes.list;
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

const useCreateTemplate = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = templatesRoutes.new;
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
      queryClient.invalidateQueries({ queryKey: ["template-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "Template created successfully"}`
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

const useUpdateTemplate = (id: string) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = templatesRoutes.single(id);
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
      queryClient.invalidateQueries({ queryKey: ["template-list"] }),
    onSuccess: (value) => {
      push(`${returnAfterSubmit}`);

      showToast(
        "success",
        "Success!",
        `${value?.message ?? "Template updated successfully"}`
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

const useDeleteTemplate = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const url = templatesRoutes.single(id);
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
      queryClient.invalidateQueries({ queryKey: ["template-list"] }),
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "Template deleted successfully"}`
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

const useSingleTemplate = (id: string) => {
  return useQuery({
    queryKey: ["template-single", id],
    queryFn: async () => {
      try {
        const url = templatesRoutes.single(id);
        const { data } = await axiosInstance.get(url);
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
    staleTime: 10000,
    enabled: !!id,
  });
};

export {
  useGetTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useSingleTemplate,
};
