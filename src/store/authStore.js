import { reactive } from "vue";

const TOKEN_KEY = "task_app_token";

const state = reactive({
  token: localStorage.getItem(TOKEN_KEY) || "",
});

export function useAuthStore() {
  function setToken(token) {
    state.token = token;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  function getToken() {
    return state.token;
  }

  function isLoggedIn() {
    return !!state.token;
  }

  function logout() {
    setToken("");
  }

  return {
    setToken,
    getToken,
    isLoggedIn,
    logout,
    state,
  };
}
