import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { messagesRoutes } from "@/config/apiRoutes";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormReviewMessageProps, PaginateParams } from "@/types/types";
import { showToast } from "@/lib/toastUtil";

const returnAfterSubmit = "/messages/new-message";

const useGetMessages = ({ page, limit, search }: PaginateParams) => {
  return useQuery({
    queryKey: ["message-list"],
    queryFn: async () => {
      try {
        const url = messagesRoutes.list;
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

const useCreateMessage = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormReviewMessageProps) => {
      try {
        const url = messagesRoutes.new;
        const { data } = await axiosInstance.post(url, payload);
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
      queryClient.invalidateQueries({ queryKey: ["message-list"] }),
    onSuccess: (value) => {
      push(`${returnAfterSubmit}`);
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

const useSingleMessage = (id: string) => {
  return useQuery({
    queryKey: ["message-single", id],
    queryFn: async () => {
      try {
        const url = messagesRoutes.single(id);
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

export { useGetMessages, useCreateMessage, useSingleMessage };
