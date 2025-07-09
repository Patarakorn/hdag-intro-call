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

// Types for CaseDocument API
export type UploadCaseRes = { ok: boolean; id: string; filename: string };
export type UploadCaseError = { ok: false; error: string };
export type DeleteCaseRes = { ok: boolean; message: string };
export type DeleteCaseError = { ok: false; error: string };
export type ListCasesRes = { ok: boolean; data: { id: string; name: string; size: string; uploadDate: string }[] };

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

// Upload a case document (PDF)
export async function uploadCaseDocument(file: File): Promise<UploadCaseRes> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/cases", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }
  return response.json();
}

// Delete a case document by ID
export async function deleteCaseDocument(id: string): Promise<DeleteCaseRes> {
  const response = await fetch(`/api/admin/cases/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Delete failed");
  }
  return response.json();
}

// React Query hooks for cases
export function useUploadCaseDocument() {
  return useMutation<UploadCaseRes, Error, File>({
    mutationFn: uploadCaseDocument,
  });
}

export function useDeleteCaseDocument() {
  return useMutation<DeleteCaseRes, Error, string>({
    mutationFn: deleteCaseDocument,
  });
}

export function useListCases() {
  return useQuery<ListCasesRes>({
    queryKey: ["cases"],
    queryFn: async () => {
      const response = await fetch("/api/admin/cases");
      if (!response.ok) {
        throw new Error("Failed to fetch cases");
      }
      return response.json();
    },
    retry: false,
  });
}
