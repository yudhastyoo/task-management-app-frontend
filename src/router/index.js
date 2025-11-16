import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import TaskListView from "../views/TaskListView.vue";
import { useAuthStore } from "../store/authStore";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/tasks",
    name: "tasks",
    component: TaskListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/tasks",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    next({ name: "login" });
  } else if (to.name === "login" && auth.isLoggedIn()) {
    next({ name: "tasks" });
  } else {
    next();
  }
});

export default router;
