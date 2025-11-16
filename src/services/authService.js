import { loginApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export async function loginService({ username, password }) {
  const auth = useAuthStore();

  const response = await loginApi({ username, password });
  const token = response.data.token;

  auth.setToken(token);

  return token;
}

export function logoutService() {
  const auth = useAuthStore();
  auth.logout();
}
