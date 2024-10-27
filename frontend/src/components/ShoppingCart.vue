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
              Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="checkoutForm.name"
              type="text"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{
                'border-red-500': nameError,
                'border-green-500': checkoutForm.name && !nameError,
              }"
              @input="validateName"
              placeholder="e.g., John Smith or Mary Jane-Smith"
            />
            <p v-if="nameError" class="mt-1 text-sm text-red-500">
              {{ nameError }}
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">
              Allowed: letters, spaces, hyphens, and apostrophes
            </p>
          </div>

          <!-- Phone Input -->
          <div class="mb-6">
            <label class="block text-gray-700 mb-2" for="phone">
              Phone <span class="text-red-500">*</span>
            </label>
            <input
              id="phone"
              v-model="checkoutForm.phone"
              type="tel"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{
                'border-red-500': phoneError,
                'border-green-500': checkoutForm.phone && !phoneError,
              }"
              @input="validatePhone"
              placeholder="e.g., (123) 456-7890"
            />
            <p v-if="phoneError" class="mt-1 text-sm text-red-500">
              {{ phoneError }}
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">
              Format: +X (XXX) XXX-XXXX or XXXXXXXXXX
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
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
      // Validate name: letters, spaces, hyphens, apostrophes
      const nameRegex = /^[A-Za-z][A-Za-z''-]+([ ][A-Za-z][A-Za-z''-]+)*$/;

      if (!this.checkoutForm.name) {
        this.nameError = "Name is required";
      } else if (this.checkoutForm.name.length < 2) {
        this.nameError = "Name must be at least 2 characters long";
      } else if (this.checkoutForm.name.length > 50) {
        this.nameError = "Name must not exceed 50 characters";
      } else if (!nameRegex.test(this.checkoutForm.name.trim())) {
        this.nameError =
          "Please enter a valid name (e.g., John Smith, Mary Jane-Smith, O'Connor)";
      } else {
        this.nameError = "";
      }
    },

    validatePhone() {
      // Validate phone: optional country code, area code, proper formatting
      const phoneRegex =
        /^(?:\+?\d{1,3}[-. ]?)?\(?(?:\d{3})\)?[-. ]?\d{3}[-. ]?\d{4}$/;

      if (!this.checkoutForm.phone) {
        this.phoneError = "Phone number is required";
      } else {
        // Remove all non-digits for length checking
        const digitsOnly = this.checkoutForm.phone.replace(/[^0-9]/g, "");

        if (digitsOnly.length < 10) {
          this.phoneError = "Phone number must have at least 10 digits";
        } else if (digitsOnly.length > 15) {
          this.phoneError = "Phone number cannot exceed 15 digits";
        } else if (!phoneRegex.test(this.checkoutForm.phone)) {
          this.phoneError =
            "Please enter a valid phone number (e.g., +1 (123) 456-7890 or 1234567890)";
        } else {
          this.phoneError = "";
        }
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
