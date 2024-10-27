<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
  >
    <div class="flex items-center mb-4">
      <i :class="['fas', lesson.icon, 'text-3xl text-blue-600 mr-4']"></i>
      <h2 class="text-xl font-semibold text-gray-800">{{ lesson.subject }}</h2>
    </div>
    <div class="space-y-2">
      <p class="text-gray-600">
        <i class="fas fa-location-dot mr-2"></i>
        {{ lesson.location }}
      </p>
      <p class="text-gray-600">
        <i class="fas fa-pound-sign mr-2"></i>
        {{ lesson.price }}
      </p>
      <p class="text-gray-600">
        <i class="fas fa-user-group mr-2"></i>
        Spaces: {{ lesson.spaces }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonCard",
  props: {
    lesson: {
      type: Object,
      required: true,
    },
  },
};
</script>
