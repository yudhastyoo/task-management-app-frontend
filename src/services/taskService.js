import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/taskApi";

export async function getTasksService() {
  const response = await fetchTasksApi();
  return response.data; // anggap backend return List<TaskResponse>
}

export async function createTaskService(task) {
  const response = await createTaskApi(task);
  return response.data;
}

export async function updateTaskService(id, task) {
  const response = await updateTaskApi(id, task);
  return response.data;
}

export async function deleteTaskService(id) {
  await deleteTaskApi(id);
}
