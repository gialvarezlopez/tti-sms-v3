import { create } from "zustand";
import { BranchProps } from "@/types/types";

// Define el estado global para manejar las ramas (branches)
interface BranchesStore {
  branches: BranchProps[]; // Lista de ramas
  setBranches: (newBranches: BranchProps[]) => void; // Función para actualizar la lista de ramas
  clearBranches: () => void; // Función para limpiar la lista de ramas
}

const useBranchesStore = create<BranchesStore>((set) => ({
  branches: [], // Inicializa con un arreglo vacío
  setBranches: (newBranches) => set({ branches: newBranches }), // Función para actualizar la lista
  clearBranches: () => set({ branches: [] }), // Función para limpiar la lista de ramas
}));

export default useBranchesStore;
