<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Available Lessons</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
    </div>
  </div>
</template>

<script>
import LessonCard from "./LessonCard.vue";
import { lessons } from "../data/lessons.js";

export default {
  name: "LessonList",
  components: {
    LessonCard,
  },
  data() {
    return {
      lessons,
    };
  },
};
</script>
