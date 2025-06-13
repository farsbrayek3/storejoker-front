import { create } from "zustand";

type User = {
  id: string;
  username: string;
  email: string;
  roles: string[];
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
