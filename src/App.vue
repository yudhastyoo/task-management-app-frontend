<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-white shadow mb-4">
      <div
        class="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center"
        :class="isLoggedIn ? 'justify-between' : 'justify-center'"
      >
        <h1 class="text-xl font-semibold">Task Management App</h1>
        <button
          v-if="isLoggedIn"
          @click="handleLogout"
          class="text-sm text-red-500 hover:underline cursor-pointer border border-red-500 px-2 py-1 rounded-sm"
        >
          Logout
        </button>
      </div>
    </header>

    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-4 py-2">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from "./store/authStore";
import { logoutService } from "./services/authService";

export default {
  name: "App",
  data() {
    const auth = useAuthStore();
    return { auth };
  },
  computed: {
    isLoggedIn() {
      return this.auth.isLoggedIn();
    },
  },
  methods: {
    handleLogout() {
      logoutService();
      this.$router.push({ name: "login" });
    },
  },
};
</script>
