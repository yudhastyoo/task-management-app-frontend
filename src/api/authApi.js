import http from "./http";

export function loginApi(payload) {
  return http.post("/api/auth/login", payload);
}
