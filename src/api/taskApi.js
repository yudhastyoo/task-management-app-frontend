import http from "./http";

export function fetchTasksApi() {
  return http.get("/api/tasks");
}

export function createTaskApi(payload) {
  // payload: { title, description, status }
  return http.post("/api/tasks", payload);
}

export function updateTaskApi(id, payload) {
  return http.put(`/api/tasks/${id}`, payload);
}

export function deleteTaskApi(id) {
  return http.delete(`/api/tasks/${id}`);
}
