import { TicketsProps } from "@/types/types";
import { create } from "zustand";

interface TicketsStore {
  tickets: TicketsProps[];
  setTickets: (tickets: TicketsProps[]) => void;
  clearTickets: () => void;
}

const useTicketsStore = create<TicketsStore>((set) => ({
  tickets: [],
  setTickets: (newTickets) => set({ tickets: newTickets }),
  clearTickets: () => set({ tickets: [] }), // Esta función limpiará el arreglo
}));

export default useTicketsStore;

/*
interface TicketsStore {
  numbers: number[];
  setNumbers: (numbers: number[]) => void;
  clearNumbers: () => void;
}

const useTicketsStore = create<TicketsStore>((set) => ({
  numbers: [],
  setNumbers: (newNumbers) => set({ numbers: newNumbers }),
  clearNumbers: () => set({ numbers: [] }), // Esta función limpiará el arreglo
}));

export default useTicketsStore;
*/

/*
// Define el estado global para manejar los usuarios
interface UsersStore {
  users: UserProps[]; // Lista de usuarios
  setUsers: (newUsers: UserProps[]) => void; // Función para actualizar la lista de usuarios
  clearUsers: () => void; // Función para limpiar la lista de usuarios
}

const useUsersStore = create<UsersStore>((set) => ({
  users: [], // Inicializa con un arreglo vacío
  setUsers: (newUsers) => set({ users: newUsers }), // Función para actualizar la lista
  clearUsers: () => set({ users: [] }), // Función para limpiar la lista de usuarios
}));

export default useUsersStore;
*/
