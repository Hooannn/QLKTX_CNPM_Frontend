/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { createJSONStorage } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { IUser } from "../types";
interface AuthStore {
  isLoggedIn: boolean;
  user?: IUser;
  accessToken?: string;

  setLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: IUser) => void;
  setAccessToken: (accessToken: string) => void;
  reset: () => void;
}

const initialState = {
  isLoggedIn: false,
  user: undefined,
  accessToken: undefined,
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setLoggedIn: (isLoggedIn) => set((state) => ({ isLoggedIn })),
      setUser: (user) => set((state) => ({ user })),
      setAccessToken: (accessToken) => set((state) => ({ accessToken })),
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
