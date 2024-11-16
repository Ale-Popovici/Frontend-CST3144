<template>
  <div class="w-full mb-6">
    <!-- Search Container -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="relative">
        <!-- Search Input -->
        <input
          type="text"
          v-model="searchTerm"
          @input="handleSearch"
          placeholder="Search by subject, location, price..."
          class="w-full px-4 py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <!-- Search Icon -->
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="fas fa-search text-gray-400"></i>
        </div>

        <!-- Loading Spinner -->
        <div
          v-if="isLoading"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <div
            class="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"
          ></div>
        </div>

        <!-- Clear Search Button -->
        <button
          v-if="searchTerm && !isLoading"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Search Info -->
      <div
        v-if="searchTerm"
        class="mt-2 text-sm text-gray-600 flex items-center justify-between"
      >
        <span>
          Found {{ resultsCount }} result{{ resultsCount !== 1 ? "s" : "" }} for
          "{{ searchTerm }}"
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import debounce from "lodash/debounce";

export default {
  name: "SearchBar",
  props: {
    initialCount: {
      type: Number,
      default: 0,
    },
  },
  emits: ["search"],
  setup(props, { emit }) {
    const searchTerm = ref("");
    const isLoading = ref(false);
    const resultsCount = ref(props.initialCount);

    // Create debounced search function
    const debouncedSearch = debounce(async (term) => {
      isLoading.value = true;
      try {
        emit("search", term);
      } finally {
        isLoading.value = false;
      }
    }, 300); // 300ms delay for better performance

    const handleSearch = () => {
      debouncedSearch(searchTerm.value);
    };

    const clearSearch = () => {
      searchTerm.value = "";
      debouncedSearch("");
    };

    // Watch for changes in search results count
    watch(
      () => props.initialCount,
      (newCount) => {
        resultsCount.value = newCount;
      }
    );

    return {
      searchTerm,
      isLoading,
      resultsCount,
      handleSearch,
      clearSearch,
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
