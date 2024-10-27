<template>
  <transition name="toast">
    <div
      v-if="show"
      class="fixed bottom-4 right-4 max-w-md w-full mx-4 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div class="p-4 flex items-center space-x-4">
        <!-- Success Icon -->
        <div class="flex-shrink-0 bg-green-100 rounded-full p-2">
          <i class="fas fa-check-circle text-green-500 text-xl"></i>
        </div>

        <!-- Message Content -->
        <div class="flex-1">
          <h4 class="text-gray-800 font-medium flex items-center gap-2">
            Added to Cart!
            <span
              v-if="multiplier > 1"
              class="inline-flex items-center justify-center bg-blue-500 text-white text-sm px-2 py-1 rounded-full animate-bounce"
            >
              x{{ multiplier }}
            </span>
          </h4>
          <p class="text-gray-600">{{ message }}</p>
        </div>

        <!-- Cart Animation -->
        <div class="cart-animation">
          <i class="fas fa-shopping-cart text-blue-500 text-xl"></i>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="h-1 bg-gray-200">
        <div
          class="h-full bg-green-500 progress-bar"
          :style="{ animation: 'progress 3s linear forwards' }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ToastNotification",
  props: {
    show: Boolean,
    message: String,
    multiplier: {
      type: Number,
      default: 1,
    },
  },
};
</script>

<style scoped>
/* Previous styles remain the same */

/* Add multiplier animation */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 0.5s infinite;
}
</style>
