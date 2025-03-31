import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { ticketsRoutes } from "@/config/apiRoutes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginateParams, ResendMessageProps, UserProps } from "@/types/types";
import { showToast } from "@/lib/toastUtil";

interface TicketParams extends PaginateParams {
  status?: string[]; // It can be: 'in_progress', 'overdue', 'toBeOverdue', 'closed', 'error'
  templates?: string[] | null;
  branches?: string[] | null;
  types?: string[]; // It can be: 'oneway' o 'twoway'
  last_sent?: string[]; // Array con dos fechas [start, end]
  last_received?: string[]; // Array con dos fechas [start, end]
}

const useGetTickets = ({
  page,
  limit,
  query,
  status,
  templates,
  types,
  branches,
  last_sent,
  last_received,
}: TicketParams) => {
  //const queryClient = useQueryClient();
  return useQuery({
    queryKey: [
      "ticket-list",
      page,
      limit,
      query,
      status,
      templates,
      branches,
      last_sent,
      last_received,
      types,
    ],
    queryFn: async () => {
      try {
        const isFilter =
          query?.length ||
          status?.length ||
          templates?.length ||
          branches?.length ||
          last_sent?.length ||
          last_received?.length ||
          types?.length;

        // Filters - Only added if they exist
        const params: TicketParams = {
          page,
          limit,
          query,
          ...(status?.length && { status }),
          ...(templates?.length && { templates }),
          ...(branches?.length && { branches }),
          ...(last_sent?.length && { last_sent }),
          ...(last_received?.length && { last_received }),
          ...(types?.length && { types }),
        };

        if (isFilter) {
          const url = ticketsRoutes.filter;
          const { data } = await axiosInstance.post(url, params);
          /*
          queryClient.invalidateQueries({
            queryKey: ["stats-list", branches, status],
          });
          */
          return data;
        } else {
          const url = ticketsRoutes.list;
          const { data } = await axiosInstance.get(url, { params });
          return data;
        }
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
    retry: false,
  });
};

const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = ticketsRoutes.new;
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
      queryClient.invalidateQueries({ queryKey: ["ticket-list"] }),
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

const useResendReminderThread = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ResendMessageProps) => {
      try {
        const url = ticketsRoutes.reminder(id);
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

const useCloseMultiplesTickets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      ids: string[];
      operation: string;
      data: { status: string };
    }) => {
      try {
        const url = ticketsRoutes.multiOption;

        const { data } = await axiosInstance.patch(url, {
          operation: payload.operation,
          ids: payload.ids,
          data: payload.data,
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-list"] });
      queryClient.invalidateQueries({ queryKey: ["stats-list"] });
    },
    onSuccess: (value, variables) => {
      const { ids } = variables;
      showToast(
        "success",
        "Success!",
        `${
          value?.message ??
          `${ids?.length > 1 ? "Tickets" : "Ticket"} closed successfully`
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
  useGetTickets,
  useCreateTicket,
  useCloseMultiplesTickets,
  useResendReminderThread,
};
