import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,

      // Derived state
      isLoggedIn: false,

      login: (token) =>
        set({
          accessToken: token,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          accessToken: null,
          isLoggedIn: false,
        }),

      setToken: (token) =>
        set({
          accessToken: token,
          isLoggedIn: !!token,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
