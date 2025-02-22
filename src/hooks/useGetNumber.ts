//src/components/hooks/
/*
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { auditsRoutes } from "@/config/apiRoutes";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PaginateParams } from "@/types/types";

const useGetAudits = ({ page, limit, search }: PaginateParams) => {
  return useQuery({
    queryKey: ["audit-list"],
    queryFn: async () => {
      try {
        const url = auditsRoutes.list;
        const { data } = await axiosInstance.get(url, {
          params: { page, limit, search },
        });
        return data; // Asumiendo que `data` ya es el arreglo de clientes
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          // Verificar si el error tiene una respuesta con un mensaje

          const errorMessage =
            e.response.data.message ||
            e.response.data.error ||
            "Unknown error";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
  });
};

const useAuditDeleteMultiple = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      ids: string[];
      noRedirect?: boolean;
      productId?: string;
    }) => {
      try {
        const url = auditsRoutes.deleteMultiple;
        const { data } = await axiosInstance.delete(url, { data: payload });
        return data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          // Verificar si el error tiene una respuesta con un mensaje

          const errorMessage =
            e.response.data.message ||
            e.response.data.error ||
            "Unknown error";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidar la query general de lista
      queryClient.invalidateQueries({ queryKey: ["audit-list"] });

      // Si noRedirect es true y se proporciona un productId, invalidar la query específica
      if (variables.noRedirect && variables.productId) {
        queryClient.invalidateQueries({
          queryKey: ["audit-single", variables.productId],
        });
      }
    },
    onSuccess: (value, variables) => {
      //console.log("value", value);
      toast({
        variant: "default",
        title: "Success!",
        description: value?.message,
      });
      if (!variables.noRedirect) {
        push("/inventario/auditoria");
      }
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

const useAuditSingleProduct = ({
  page,
  limit,
  search,
  productId,
}: PaginateParams & { productId: string }) => {
  return useQuery({
    queryKey: ["audit-single", productId],
    queryFn: async () => {
      try {
        const url = auditsRoutes.listProduct(productId);
        const { data } = await axiosInstance.get(url, {
          params: { page, limit, search },
        });
        return data;
      } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
          // Verificar si el error tiene una respuesta con un mensaje

          const errorMessage =
            e.response.data.message ||
            e.response.data.error ||
            "Unknown error a";
          throw new Error(errorMessage);
        } else {
          throw new Error("Unknown error");
        }
      }
    },
    //staleTime: 10000,
    enabled: !!productId,
  });
};

export { useGetAudits, useAuditDeleteMultiple, useAuditSingleProduct };
*/
