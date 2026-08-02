const BASE_URL = import.meta.env["VITE_API_URL"] ?? "";

interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}

interface ParsedResponse {
  message?: string;
  status?: number;
  timestamp?: string;
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
  });

  // Some endpoints (change-password) return an empty body
  const text = await res.text();
  let data: ParsedResponse | string | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err =
      data && typeof data === "object" && !Array.isArray(data)
        ? (data as ParsedResponse)
        : { status: res.status, message: "Request failed", timestamp: "" };

    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  return data;
}

export default request;
