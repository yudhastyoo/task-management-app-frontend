<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-semibold">Tasks</h2>
        <!-- <p class="text-sm text-gray-500">Kelola daftar tugasmu.</p> -->
      </div>
      <button
        @click="openCreate"
        class="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
      >
        + Add Task
      </button>
    </div>

    <!-- Error global -->
    <p v-if="serverError" class="text-red-500 text-sm">
      {{ serverError }}
    </p>

    <!-- Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full text-sm table-fixed">
        <thead>
          <tr
            class="bg-gray-200 text-gray-700 text-xs font-semibold uppercase tracking-wide"
          >
            <th class="px-4 py-3 w-12 text-left">No</th>
            <th class="px-4 py-3 w-52 text-left">Title</th>
            <th class="px-4 py-3 w-36 text-left">Status</th>
            <th class="px-4 py-3 text-left">Description</th>
            <th class="px-4 py-3 w-32 text-right">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y">
          <tr v-if="loading && tasks.length === 0">
            <td colspan="5" class="px-4 py-3 text-center">Loading...</td>
          </tr>
          <tr v-else-if="tasks.length === 0">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              Belum ada task.
            </td>
          </tr>

          <tr
            v-for="(task, index) in tasks"
            :key="task.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2 text-center font-medium">{{ index + 1 }}</td>

            <td class="px-4 py-2 font-medium truncate">
              {{ task.title }}
            </td>

            <td class="px-4 py-2">
              <span
                class="px-2 py-1 text-xs rounded-full whitespace-nowrap font-medium"
                :class="statusClass(task.status)"
              >
                {{ statusLabel(task.status) }}
              </span>
            </td>

            <td class="px-4 py-2 text-gray-700">
              <span class="line-clamp-2 leading-relaxed">
                {{ task.description }}
              </span>
            </td>

            <td class="px-4 py-2 text-right space-x-3">
              <button
                @click="openEdit(task)"
                class="text-blue-600 hover:underline text-xs font-medium"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(task)"
                class="text-red-500 hover:underline text-xs font-medium"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form (create/edit) -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="max-w-md w-full">
        <TaskForm
          v-model="form"
          :isEdit="Boolean(editingTaskId)"
          :loading="saving"
          :serverError="formError"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskForm from "../components/TaskForm.vue";
import {
  getTasksService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskService";

export default {
  name: "TaskListView",
  components: { TaskForm },
  data() {
    return {
      tasks: [],
      loading: false,
      saving: false,
      serverError: "",
      formError: "",
      showForm: false,
      editingTaskId: null,
      form: {
        title: "",
        description: "",
        status: "",
      },
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      this.loading = true;
      this.serverError = "";
      try {
        this.tasks = await getTasksService();
      } catch (err) {
        this.serverError =
          err.response?.data?.message || "Gagal memuat daftar task.";
      } finally {
        this.loading = false;
      }
    },

    openCreate() {
      this.editingTaskId = null;
      this.form = {
        title: "",
        description: "",
        status: "",
      };
      this.formError = "";
      this.showForm = true;
    },

    openEdit(task) {
      this.editingTaskId = task.id;
      this.form = {
        title: task.title,
        description: task.description,
        status: task.status,
      };
      this.formError = "";
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
    },

    async handleSubmit(payload) {
      this.saving = true;
      this.formError = "";

      try {
        if (this.editingTaskId) {
          await updateTaskService(this.editingTaskId, payload);
        } else {
          await createTaskService(payload);
        }
        this.showForm = false;
        await this.fetchTasks();
      } catch (err) {
        this.formError = err.response?.data?.message || "Gagal menyimpan task.";
      } finally {
        this.saving = false;
      }
    },

    async confirmDelete(task) {
      const ok = window.confirm(`Yakin ingin menghapus task "${task.title}"?`);
      if (!ok) return;

      try {
        await deleteTaskService(task.id);
        await this.fetchTasks();
      } catch (err) {
        this.serverError =
          err.response?.data?.message || "Gagal menghapus task.";
      }
    },

    statusClass(status) {
      switch (status) {
        case "TODO":
          return "bg-gray-100 text-gray-700";
        case "IN_PROGRESS":
          return "bg-yellow-100 text-yellow-800";
        case "DONE":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-700";
      }
    },

    statusLabel(status) {
      switch (status) {
        case "TODO":
          return "To Do";
        case "IN_PROGRESS":
          return "In Progress";
        case "DONE":
          return "Done";
        default:
          return status;
      }
    },
  },
};
</script>
