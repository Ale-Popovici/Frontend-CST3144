<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Available Lessons</h1>

    <!-- Sorting Controls -->
    <div
      class="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-lg shadow"
    >
      <div class="flex items-center">
        <label for="sortBy" class="mr-2 text-gray-700">Sort by:</label>
        <select
          id="sortBy"
          v-model="sortBy"
          class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="subject">Subject</option>
          <option value="location">Location</option>
          <option value="price">Price</option>
          <option value="spaces">Spaces</option>
        </select>
      </div>

      <button
        @click="toggleSortOrder"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <i :class="['fas', sortOrderIcon]"></i>
        {{ sortOrderText }}
      </button>
    </div>

    <!-- Sort Indicator -->
    <SortIndicator :attribute="sortBy" :order="ascending" class="mb-6" />

    <!-- Lessons Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      :key="sortBy + ascending"
    >
      <LessonCard
        v-for="lesson in sortedLessons"
        :key="lesson.id"
        :lesson="lesson"
      />
    </div>
  </div>
</template>

<script>
import LessonCard from "./LessonCard.vue";
import SortIndicator from "./SortIndicator.vue";
import { lessons } from "../data/lessons.js";

export default {
  name: "LessonList",
  components: {
    LessonCard,
    SortIndicator,
  },
  data() {
    return {
      lessons,
      sortBy: "subject", // default sort attribute
      ascending: true, // default sort order
    };
  },
  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let compareA = a[this.sortBy];
        let compareB = b[this.sortBy];

        // Handle string comparison
        if (typeof compareA === "string") {
          compareA = compareA.toLowerCase();
          compareB = compareB.toLowerCase();
        }

        // Handle numeric comparison
        if (this.sortBy === "price" || this.sortBy === "spaces") {
          compareA = Number(compareA);
          compareB = Number(compareB);
        }

        if (compareA < compareB) return this.ascending ? -1 : 1;
        if (compareA > compareB) return this.ascending ? 1 : -1;
        return 0;
      });
    },
    sortOrderIcon() {
      if (this.sortBy === "price" || this.sortBy === "spaces") {
        return this.ascending ? "fa-arrow-up-1-9" : "fa-arrow-down-9-1";
      }
      return this.ascending ? "fa-arrow-up-a-z" : "fa-arrow-down-z-a";
    },
    sortOrderText() {
      return this.ascending ? "Ascending" : "Descending";
    },
  },
  methods: {
    toggleSortOrder() {
      this.ascending = !this.ascending;
    },
  },
};
</script>
