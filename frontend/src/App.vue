<template>
  <div class="min-h-screen bg-gray-100">
    <LessonList />
  </div>
</template>

<script>
import LessonList from "./components/LessonList.vue";

export default {
  name: "App",
  components: {
    LessonList,
  },
};
</script>
