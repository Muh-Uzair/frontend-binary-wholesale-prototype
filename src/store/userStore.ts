// src/store/userStore.ts
import { create } from "zustand";

export interface User {
  fullName: string;
  email: string;
  role: "user" | "admin" | string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (userData: User | null) => void;
  signin: (userData: User) => void;
  signout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (userData) =>
    set({
      user: userData,
      isAuthenticated: !!userData,
      isLoading: false,
    }),

  signin: (userData) =>
    set({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    }),

  signout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
