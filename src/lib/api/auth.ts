// src/lib/api/auth.ts
import { client } from "@/lib/hono";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

type LoginReq = InferRequestType<typeof client.api.auth.login.$post>["json"];
type LoginRes = InferResponseType<typeof client.api.auth.login.$post>;

type MeRes = InferResponseType<typeof client.api.auth.me.$get>;

type LogoutRes = InferResponseType<typeof client.api.auth.logout.$post>;

// POST /api/auth/login
export function useLogin() {
  return useMutation<LoginRes, Error, LoginReq>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login.$post({ json });
      const data = await response.json();
      // ② cast it so TS knows this is LoginRes
      return data as LoginRes;
    },
    onError: (err) => {
      // show error however you like
      console.error(err);
    },
  });
}

// GET /api/auth/me
export function useMe() {
  return useQuery<MeRes>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await client.api.auth.me.$get();
      if (!response.ok) {
        throw new Error("Unauthorized");
      }
      const data = await response.json();
      return data as MeRes;
    },
    retry: false,
  });
}

// POST /api/auth/logout
export function useLogout() {
  return useMutation<LogoutRes, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      const data = await response.json();
      return data as LogoutRes;
    },
    onError: (err) => {
      console.error("Logout error:", err);
    },
  });
}
