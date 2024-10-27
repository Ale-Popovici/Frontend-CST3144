<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Available Lessons</h1>

      <!-- Cart Button -->
      <button
        @click="showCart = !showCart"
        :disabled="cartItems.length === 0"
        class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
        :class="[
          cartItems.length > 0
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed',
        ]"
      >
        <i class="fas fa-shopping-cart text-xl mr-2"></i>
        <span class="font-medium">Cart Items: {{ cartItemsCount }}</span>
      </button>
    </div>

    <transition name="fade" mode="out-in">
      <!-- Shopping Cart View -->
      <ShoppingCart
        v-if="showCart"
        :cartItems="cartItems"
        @toggle-cart="showCart = false"
        @remove-from-cart="removeFromCart"
        @checkout-complete="handleCheckoutComplete"
      />

      <!-- Lessons View -->
      <div v-else>
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
            @add-to-cart="addToCart"
          />
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <ToastNotification
      :show="showToast"
      :message="toastMessage"
      :multiplier="toastMultiplier"
    />
  </div>
</template>

<script>
import LessonCard from "./LessonCard.vue";
import SortIndicator from "./SortIndicator.vue";
import ToastNotification from "./ToastNotification.vue";
import ShoppingCart from "./ShoppingCart.vue";
import { lessons } from "../data/lessons.js";

export default {
  name: "LessonList",
  components: {
    LessonCard,
    SortIndicator,
    ToastNotification,
    ShoppingCart,
  },
  data() {
    return {
      lessons: lessons.map((lesson) => ({
        ...lesson,
        spaces: lesson.spaces,
        clickCount: 0,
        lastClickTime: 0,
      })),
      sortBy: "subject",
      ascending: true,
      cartItems: [],
      showToast: false,
      toastMessage: "",
      toastMultiplier: 1,
      showCart: false,
    };
  },
  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let compareA = a[this.sortBy];
        let compareB = b[this.sortBy];
        if (typeof compareA === "string") {
          compareA = compareA.toLowerCase();
          compareB = compareB.toLowerCase();
        }
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
    cartItemsCount() {
      return this.cartItems.length;
    },
  },
  methods: {
    toggleSortOrder() {
      this.ascending = !this.ascending;
    },
    addToCart(lesson) {
      const now = Date.now();
      const RAPID_CLICK_THRESHOLD = 1000;

      if (lesson.spaces > 0) {
        // Check for rapid clicks
        if (now - lesson.lastClickTime < RAPID_CLICK_THRESHOLD) {
          lesson.clickCount++;
        } else {
          lesson.clickCount = 1;
        }
        lesson.lastClickTime = now;

        // Reduce available spaces
        lesson.spaces--;

        // Add to cart
        this.cartItems.push({
          id: lesson.id,
          subject: lesson.subject,
          price: lesson.price,
          icon: lesson.icon,
          addedAt: new Date(),
        });

        // Show toast message with multiplier
        this.showToastMessage(
          `${lesson.subject} (£${lesson.price})`,
          lesson.clickCount
        );
      }
    },
    showToastMessage(message, multiplier = 1) {
      this.toastMessage = message;
      this.toastMultiplier = multiplier;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
        this.toastMultiplier = 1;
      }, 3000);
    },
    removeFromCart(item) {
      // Find the lesson and increase its spaces
      const lesson = this.lessons.find((l) => l.id === item.id);
      if (lesson) {
        lesson.spaces++;
      }

      // Remove item from cart
      const index = this.cartItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id && cartItem.addedAt === item.addedAt
      );
      if (index !== -1) {
        this.cartItems.splice(index, 1);
      }

      // Show toast
      this.showToastMessage(`${item.subject} removed from cart`);
    },
    handleCheckoutComplete() {
      // Clear the cart
      this.cartItems = [];
      // Hide cart view
      this.showCart = false;
      // Show success message
      this.showToastMessage("Thank you for your order!");
    },
  },
};
</script>

<style scoped>
.cart-bump {
  animation: bump 0.3s ease-out;
}

@keyframes bump {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
