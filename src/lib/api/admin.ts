import { client } from "@/lib/hono";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";

// Types for API endpoints
// GET /api/admin/users
export type GetAllowedEmailsRes = InferResponseType<typeof client.api.admin.users.$get>;
// POST /api/admin/users
export type AddAllowedEmailReq = InferRequestType<typeof client.api.admin.users.$post>["json"];
export type AddAllowedEmailRes = InferResponseType<typeof client.api.admin.users.$post>;
// DELETE /api/admin/users
export type DeleteAllowedEmailReq = { email: string };
export type DeleteAllowedEmailRes = InferResponseType<typeof client.api.admin.users.$delete>;

// GET /api/admin/users
export function useAllowedEmails() {
  return useQuery<GetAllowedEmailsRes>({
    queryKey: ["allowedEmails"],
    queryFn: async () => {
      const response = await client.api.admin.users.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch allowed emails");
      }
      const data = await response.json();
      return data as GetAllowedEmailsRes;
    },
    retry: false,
  });
}

// POST /api/admin/users
export function useAddAllowedEmail() {
  return useMutation<AddAllowedEmailRes, Error, AddAllowedEmailReq>({
    mutationFn: async (json) => {
      const response = await client.api.admin.users.$post({ json });
      const data = await response.json();
      return data as AddAllowedEmailRes;
    },
    onError: (err) => {
      console.error(err);
    },
  });
}

// DELETE /api/admin/users
export function useDeleteAllowedEmail() {
  return useMutation<DeleteAllowedEmailRes, Error, DeleteAllowedEmailReq>({
    mutationFn: async (json) => {
      const response = await client.api.admin.users.$delete({ json });
      const data = await response.json();
      return data as DeleteAllowedEmailRes;
    },
    onError: (err) => {
      console.error(err);
    },
  });
}
