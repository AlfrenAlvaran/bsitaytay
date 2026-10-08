import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const NETWORK_MESSAGE =
  "Network error. Please check your connection and try again.";
const GENERIC_MESSAGE = "Something went wrong. Try again.";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message);
  }
}

const config = {
  baseURL: "/api",
  withCredentials: true,
  timeout: 30_000,
};

const api = axios.create(config);
const refreshClient = axios.create(config);

function readFieldErrors(body: any): Record<string, string> | undefined {
  const raw = body?.fieldErrors ?? body?.errors;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  return raw as Record<string, string>;
}

function toHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) return error;
  if (axios.isAxiosError(error)) {
    if (!error.response) return new HttpError(0, NETWORK_MESSAGE);
    const body = error.response.data as any;
    return new HttpError(
      error.response.status,
      body?.message ?? GENERIC_MESSAGE,
      readFieldErrors(body),
    );
  }
  return new HttpError(0, GENERIC_MESSAGE);
}

let refreshing: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshing ??= refreshClient
    .post("/auth/refresh")
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const original = error.config as RetryableConfig | undefined;
    const isAuthRoute = original?.url?.startsWith("/auth/");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthRoute
    ) {
      original._retry = true;

      if (await refreshSession()) return api(original);

      if (typeof window !== "undefined") {
        const next = encodeURIComponent(window.location.pathname);
        window.location.assign(`/login?next=${next}`);
      }
    }

    return Promise.reject(toHttpError(error));
  },
);

async function unwrap<T>(request: Promise<AxiosResponse>): Promise<T> {
  const body = (await request).data;
  if (body && typeof body === "object" && "data" in body) return body.data as T;
  return body as T;
}

export const http = {
  get: <T>(path: string, options?: AxiosRequestConfig) =>
    unwrap<T>(api.get(path, options)),
  post: <T>(path: string, data?: unknown, options?: AxiosRequestConfig) =>
    unwrap<T>(api.post(path, data, options)),
  put: <T>(path: string, data?: unknown, options?: AxiosRequestConfig) =>
    unwrap<T>(api.put(path, data, options)),
  patch: <T>(path: string, data?: unknown, options?: AxiosRequestConfig) =>
    unwrap<T>(api.patch(path, data, options)),
  delete: <T>(path: string, options?: AxiosRequestConfig) =>
    unwrap<T>(api.delete(path, options)),
  postForm: <T>(path: string, form: FormData, options?: AxiosRequestConfig) =>
    unwrap<T>(api.post(path, form, { timeout: 60_000, ...options })),
};
