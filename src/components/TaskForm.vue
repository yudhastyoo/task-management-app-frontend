<template>
  <div class="bg-white shadow rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-3">
      {{ isEdit ? "Edit Task" : "Create Task" }}
    </h3>

    <!-- Error global -->
    <p v-if="serverError" class="text-red-500 text-sm mb-3">
      {{ serverError }}
    </p>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input
          v-model="localForm.title"
          type="text"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <p v-if="errors.title" class="text-xs text-red-500 mt-1">
          {{ errors.title }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea
          v-model="localForm.description"
          rows="3"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <p v-if="errors.description" class="text-xs text-red-500 mt-1">
          {{ errors.description }}
        </p>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium mb-1">Status</label>
        <select
          v-model="localForm.status"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300 bg-white"
        >
          <option disabled value="">Select status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <p v-if="errors.status" class="text-xs text-red-500 mt-1">
          {{ errors.status }}
        </p>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm cursor-pointer rounded border border-gray-300 hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm cursor-pointer rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <span v-if="!loading">{{ isEdit ? "Update" : "Create" }}</span>
          <span v-else>Saving...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "TaskForm",
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        title: "",
        description: "",
        status: "",
      }),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    serverError: {
      type: String,
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "submit", "cancel"],
  data() {
    return {
      localForm: {
        title: this.modelValue.title,
        description: this.modelValue.description,
        status: this.modelValue.status,
      },
      errors: {
        title: "",
        description: "",
        status: "",
      },
    };
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.localForm = { ...newVal };
      },
      deep: true,
    },
    localForm: {
      handler(newVal) {
        this.$emit("update:modelValue", newVal);
      },
      deep: true,
    },
  },
  methods: {
    validate() {
      this.errors.title = "";
      this.errors.description = "";
      this.errors.status = "";

      let isValid = true;

      if (!this.localForm.title.trim()) {
        this.errors.title = "Title is required";
        isValid = false;
      }

      if (
        this.localForm.description &&
        this.localForm.description.length > 255
      ) {
        this.errors.description = "Maximum 255 characters";
        isValid = false;
      }

      if (!this.localForm.status) {
        this.errors.status = "Status is required";
        isValid = false;
      }

      return isValid;
    },

    onSubmit() {
      if (!this.validate()) return;

      this.$emit("submit", { ...this.localForm });
    },
  },
};
</script>
