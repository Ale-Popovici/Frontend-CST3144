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
      <div v-else>
        <div class="space-y-4">
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

        <!-- Checkout Form -->
        <form @submit.prevent="handleCheckout" class="mt-8 pt-8 border-t">
          <h3 class="text-xl font-semibold mb-4">Checkout Information</h3>

          <!-- Name Input -->
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="name">
              Name
              <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="checkoutForm.name"
              type="text"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': nameError }"
              @input="validateName"
            />
            <p v-if="nameError" class="mt-1 text-sm text-red-500">
              {{ nameError }}
            </p>
          </div>

          <!-- Phone Input -->
          <div class="mb-6">
            <label class="block text-gray-700 mb-2" for="phone">
              Phone
              <span class="text-red-500">*</span>
            </label>
            <input
              id="phone"
              v-model="checkoutForm.phone"
              type="text"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': phoneError }"
              @input="validatePhone"
            />
            <p v-if="phoneError" class="mt-1 text-sm text-red-500">
              {{ phoneError }}
            </p>
          </div>

          <!-- Checkout Button -->
          <button
            type="submit"
            :disabled="!isFormValid"
            class="w-full py-3 px-4 rounded-md text-white font-medium transition-colors"
            :class="[
              isFormValid
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-300 cursor-not-allowed',
            ]"
          >
            <i class="fas fa-credit-card mr-2"></i>
            Checkout
          </button>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmation"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <div class="text-center">
          <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
          <h3 class="text-xl font-bold mb-2">Order Confirmed!</h3>
          <p class="text-gray-600 mb-6">
            Thank you {{ checkoutForm.name }}! Your order has been successfully
            submitted.
          </p>
          <button
            @click="finishCheckout"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
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
  data() {
    return {
      checkoutForm: {
        name: "",
        phone: "",
      },
      nameError: "",
      phoneError: "",
      showConfirmation: false,
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems
        .reduce((total, item) => total + item.price, 0)
        .toFixed(2);
    },
    isFormValid() {
      return (
        this.checkoutForm.name &&
        this.checkoutForm.phone &&
        !this.nameError &&
        !this.phoneError
      );
    },
  },
  methods: {
    validateName() {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!this.checkoutForm.name) {
        this.nameError = "Name is required";
      } else if (!nameRegex.test(this.checkoutForm.name)) {
        this.nameError = "Name must contain only letters";
      } else {
        this.nameError = "";
      }
    },
    validatePhone() {
      const phoneRegex = /^\d+$/;
      if (!this.checkoutForm.phone) {
        this.phoneError = "Phone number is required";
      } else if (!phoneRegex.test(this.checkoutForm.phone)) {
        this.phoneError = "Phone must contain only numbers";
      } else {
        this.phoneError = "";
      }
    },
    handleCheckout() {
      if (this.isFormValid) {
        this.showConfirmation = true;
      }
    },
    finishCheckout() {
      this.showConfirmation = false;
      // Emit event to clear cart
      this.$emit("checkout-complete");
      // Reset form
      this.checkoutForm = {
        name: "",
        phone: "",
      };
    },
  },
};
</script>
