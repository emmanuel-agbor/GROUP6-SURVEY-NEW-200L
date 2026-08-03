import request from "./client";

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const register = (payload: RegisterPayload) =>
  request("api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const login = (payload: LoginPayload) =>
  request("api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const forgotPassword = (email: string) =>
  request("api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const changePassword = (token: string, newPassword: string) =>
  request("api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });

export const getUserProfile = (userId: string) =>
  request(`api/users/${userId}/profile`, {
    method: "GET",
  });
