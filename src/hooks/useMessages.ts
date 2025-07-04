import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { messagesRoutes } from "@/config/apiRoutes";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FormReviewMessageProps,
  PaginateParams,
  ResendMessageProps,
} from "@/types/types";
import { showToast } from "@/lib/toastUtil";

const returnAfterSubmit = "/messages/new-message";

const useGetMessages = ({ page, per_page, query }: PaginateParams) => {
  return useQuery({
    queryKey: ["message-list", page, per_page, query],
    queryFn: async () => {
      try {
        const url = messagesRoutes.list;

        const params = {
          page,
          per_page,
          query,
        };

        const { data } = await axiosInstance.get(url, { params });
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

const useCreateMessage = () => {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormReviewMessageProps) => {
      try {
        const url = messagesRoutes.new;
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["message-list"] });
      queryClient.invalidateQueries({ queryKey: ["ticket-list"] });
    },
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

const useResendMessage = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ResendMessageProps) => {
      try {
        const url = messagesRoutes.resend(id);
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["message-list"] });
      queryClient.invalidateQueries({ queryKey: ["ticket-list"] });
    },
    onSuccess: (value) => {
      showToast(
        "success",
        "Success!",
        `${value?.message ?? "Message sent successfully"}`
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

export { useGetMessages, useCreateMessage, useResendMessage };
