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
        <span class="font-medium">Cart Items: {{ cartItems.length }}</span>
      </button>
    </div>

    <!-- Search Bar -->
    <SearchBar
      :initial-count="sortedLessons.length"
      @search="handleSearch"
      class="mb-6"
    />

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
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          ></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-red-50 text-red-600 p-4 rounded-lg mb-6"
        >
          {{ error }}
        </div>

        <!-- Content -->
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
          <SortIndicator
            :attribute="sortBy"
            :ascending="ascending"
            class="mb-6"
          />

          <!-- No Results Message -->
          <div
            v-if="sortedLessons.length === 0"
            class="text-center py-8 text-gray-500"
          >
            No lessons found matching your search.
          </div>

          <!-- Lessons Grid -->
          <div
            v-else
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
import SearchBar from "./SearchBar.vue";
import { api } from "../services/api";

export default {
  name: "LessonList",
  components: {
    LessonCard,
    SortIndicator,
    ToastNotification,
    ShoppingCart,
    SearchBar,
  },
  data() {
    return {
      lessons: [],
      loading: false,
      error: null,
      sortBy: "subject",
      ascending: true,
      cartItems: [],
      showToast: false,
      toastMessage: "",
      toastMultiplier: 1,
      showCart: false,
      isSearching: false,
      searchTimeout: null,
    };
  },
  computed: {
    sortedLessons() {
      return [...this.lessons].sort((a, b) => {
        let compareA = a[this.sortBy];
        let compareB = b[this.sortBy];

        // Handle string comparisons
        if (typeof compareA === "string") {
          compareA = compareA.toLowerCase();
          compareB = compareB.toLowerCase();
        }

        // Handle numeric comparisons
        if (this.sortBy === "price" || this.sortBy === "spaces") {
          compareA = Number(compareA);
          compareB = Number(compareB);
        }

        // Sort logic
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
  async created() {
    await this.fetchLessons();
  },
  methods: {
    async fetchLessons() {
      try {
        this.loading = true;
        this.lessons = await api.getLessons();
        this.lessons = this.lessons.map((lesson) => ({
          ...lesson,
          clickCount: 0,
          lastClickTime: 0,
          originalSpaces: lesson.spaces,
        }));
      } catch (error) {
        this.error = "Failed to load lessons. Please try again later.";
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    async handleSearch(searchTerm) {
      try {
        this.loading = true;
        if (!searchTerm) {
          await this.fetchLessons();
        } else {
          this.lessons = await api.searchLessons(searchTerm);
          this.lessons = this.lessons.map((lesson) => ({
            ...lesson,
            clickCount: 0,
            lastClickTime: 0,
            originalSpaces: lesson.spaces,
          }));
        }
      } catch (error) {
        console.error("Search error:", error);
        this.error = "Failed to search lessons";
      } finally {
        this.loading = false;
      }
    },

    toggleSortOrder() {
      this.ascending = !this.ascending;
    },

    addToCart(lesson) {
      const now = Date.now();
      const RAPID_CLICK_THRESHOLD = 1000;

      if (lesson.spaces > 0) {
        if (now - lesson.lastClickTime < RAPID_CLICK_THRESHOLD) {
          lesson.clickCount++;
        } else {
          lesson.clickCount = 1;
        }
        lesson.lastClickTime = now;
        lesson.spaces--;

        this.cartItems.push({
          id: lesson.id,
          subject: lesson.subject,
          price: lesson.price,
          icon: lesson.icon,
          addedAt: new Date(),
        });

        this.showToastMessage(
          `${lesson.subject} (£${lesson.price})`,
          lesson.clickCount
        );
      }
    },

    removeFromCart(item) {
      const lesson = this.lessons.find((l) => l.id === item.id);
      if (lesson) {
        lesson.spaces++;
      }

      const index = this.cartItems.findIndex(
        (cartItem) =>
          cartItem.id === item.id && cartItem.addedAt === item.addedAt
      );
      if (index !== -1) {
        this.cartItems.splice(index, 1);
      }

      this.showToastMessage(`${item.subject} removed from cart`);
    },

    async handleCheckoutComplete(orderData) {
      try {
        const lessonIds = this.cartItems.map((item) => item.id);

        // Create order in backend
        await api.createOrder({
          ...orderData,
          lessonIds,
          numberOfSpace: 1,
        });

        // After successful order, update spaces in backend
        for (const item of this.cartItems) {
          const lesson = this.lessons.find((l) => l.id === item.id);
          if (lesson) {
            await api.updateLessonSpace(lesson.id, lesson.spaces);
          }
        }

        // Clear cart and update UI
        this.cartItems = [];
        this.showCart = false;
        this.showToastMessage("Thank you for your order!");

        // Refresh lessons
        await this.fetchLessons();
      } catch (error) {
        // Restore original spaces if checkout fails
        this.lessons.forEach((lesson) => {
          lesson.spaces = lesson.originalSpaces;
        });
        this.cartItems = [];
        this.showToastMessage("Failed to complete checkout. Please try again.");
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
  },
  beforeUnmount() {
    if (this.cartItems.length > 0) {
      this.lessons.forEach((lesson) => {
        lesson.spaces = lesson.originalSpaces;
      });
    }
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
