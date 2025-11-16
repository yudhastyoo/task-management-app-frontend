<template>
  <div class="flex justify-center items-center">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-center">Login</h2>

      <p v-if="serverError" class="text-red-500 text-sm mb-3">
        {{ serverError }}
      </p>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="admin"
          />
          <p v-if="errors.username" class="text-xs text-red-500 mt-1">
            {{ errors.username }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="admin123"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:underline"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>
          <p v-if="errors.password" class="text-xs text-red-500 mt-1">
            {{ errors.password }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-60 cursor-pointer"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Loading...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { loginService } from "../services/authService";

export default {
  name: "LoginView",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      errors: {
        username: "",
        password: "",
      },
      serverError: "",
      loading: false,
      showPassword: false,
    };
  },
  methods: {
    validate() {
      this.errors.username = "";
      this.errors.password = "";
      this.serverError = "";

      let isValid = true;

      if (!this.form.username.trim()) {
        this.errors.username = "Username is required";
        isValid = false;
      }

      if (!this.form.password.trim()) {
        this.errors.password = "Password is required";
        isValid = false;
      }

      return isValid;
    },

    async onSubmit() {
      if (!this.validate()) return;

      this.loading = true;
      try {
        await loginService({
          username: this.form.username,
          password: this.form.password,
        });

        this.$router.push({ name: "tasks" });
      } catch (err) {
        this.serverError =
          err.response?.data?.message ||
          "Login gagal. Periksa username/password.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
