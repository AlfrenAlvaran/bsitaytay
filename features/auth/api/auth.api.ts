import { http } from "@/lib/http/client";
import {
  AuthUser,
  ExtractIdResponse,
  RegisterPayload,
} from "../types/auth.type";

const withFile = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return form;
};

export const authApi = {
  login: (values: { email: string; password: string }) =>
    http.post<AuthUser>("/auth/login", values),
  me: () => http.get<AuthUser>('/auth/me'),
  logout: () => http.post<void>('/auth/logout'),
  register: (payload: RegisterPayload) =>
    http.post<{ email: string }>("/auth/register", payload),
  extractId: (file: File) =>
    http.postForm<ExtractIdResponse>("/auth/extract-id", withFile(file)),
};
