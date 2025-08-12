// src/store/auth.ts
import { create } from "zustand";
import { UserDetailsType } from "./types";

export type AuthType = {
  authenticated: boolean;
  updated: boolean;
  userDetails?: UserDetailsType;
  token: string | null;
};

interface AuthStoreType extends AuthType {
  setAuthenticated: (value: boolean) => void;
  setUserDetails: (value: UserDetailsType) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStoreType>((set) => ({
  authenticated: false,
  updated: false,
  userDetails: undefined,
  token: null,
  setAuthenticated: (v: boolean) =>
    set(() => ({
      authenticated: v,
      updated: true,
    })),
  setUserDetails: (v: UserDetailsType) =>
    set(() => ({
      userDetails: v,
    })),
  setToken: (token: string | null) =>
    set(() => ({
      token,
    })),
}));
