import { isAxiosError } from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { ticketsRoutes } from "@/config/apiRoutes";
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

interface TicketParams extends PaginateParams {
  status?: string[]; // Puede ser: 'in_progress', 'overdue', 'toBeOverdue', 'closed', 'error'
  templates?: string[] | null; // Puede ser nulo
  branches?: string[] | null;
  types?: string[]; // Puede ser: 'oneway' o 'twoway'
  last_sent?: string[]; // Array con dos fechas [start, end]
  last_received?: string[]; // Array con dos fechas [start, end]
}

const useGetTickets = ({
  page,
  limit,
  search,
  status,
  templates,
  types,
  branches,
  last_sent,
  last_received,
}: TicketParams) => {
  return useQuery({
    queryKey: [
      "ticket-list",
      page,
      limit,
      search,
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
          search,
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
    retry: false,
  });
};

const useCreateTicket = () => {
  const { push } = useRouter();
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

/*
const useUpdateTicket = (id: string) => {
  const { push } = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UserProps) => {
      try {
        const url = ticketsRoutes.single(id);
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
*/
/*
const useCloseTicket = () => {
  const { push } = useRouter();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const url = ticketsRoutes.single(id);
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
      queryClient.invalidateQueries({ queryKey: ["ticket-list"] }),
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
*/
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
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["ticket-list"] }),
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
  //useUpdateTicket,
  //useCloseTicket,
  useCloseMultiplesTickets,
};
