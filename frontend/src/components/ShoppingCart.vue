<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        <button
          @click="$emit('toggle-cart')"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-arrow-left"></i>
          Back to Lessons
        </button>
      </div>

      <!-- Empty Cart Message -->
      <div v-if="cartItems.length === 0" class="text-center py-8">
        <i class="fas fa-shopping-cart text-gray-400 text-5xl mb-4"></i>
        <p class="text-gray-500">Your cart is empty</p>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id + item.addedAt"
          class="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <i :class="['fas', item.icon, 'text-2xl text-blue-600']"></i>
            <div>
              <h3 class="font-medium text-gray-800">{{ item.subject }}</h3>
              <p class="text-gray-600">£{{ item.price }}</p>
            </div>
          </div>

          <button
            @click="$emit('remove-from-cart', item)"
            class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
          >
            <i class="fas fa-trash"></i>
            Remove
          </button>
        </div>

        <!-- Cart Summary -->
        <div class="mt-6 pt-6 border-t">
          <div class="flex justify-between text-lg font-medium">
            <span>Total:</span>
            <span>£{{ totalPrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShoppingCart",
  props: {
    cartItems: {
      type: Array,
      required: true,
    },
  },
  computed: {
    totalPrice() {
      return this.cartItems
        .reduce((total, item) => total + item.price, 0)
        .toFixed(2);
    },
  },
};
</script>
