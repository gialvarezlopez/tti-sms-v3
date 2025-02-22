import { create } from "zustand";
import { UserProps } from "@/types/types";

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
