// src/components/SortIndicator.vue
<template>
  <div class="flex items-center text-sm text-gray-600 mt-2">
    <i class="fas fa-info-circle mr-2"></i>
    <span>
      Sorted by: <strong>{{ formatAttribute(attribute) }}</strong> in
      <strong>{{ ascending ? "ascending" : "descending" }}</strong> order
      <i
        :class="[
          'fas ml-2',
          ascending ? 'fa-arrow-up-a-z' : 'fa-arrow-down-z-a',
        ]"
      ></i>
    </span>
  </div>
</template>

<script>
export default {
  name: "SortIndicator",
  props: {
    attribute: {
      type: String,
      required: true,
      validator: (value) =>
        ["subject", "location", "price", "spaces"].includes(value),
    },
    ascending: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    formatAttribute(attr) {
      const attributeMap = {
        subject: "Subject",
        location: "Location",
        price: "Price",
        spaces: "Available Spaces",
      };
      return attributeMap[attr] || attr.charAt(0).toUpperCase() + attr.slice(1);
    },
  },
};
</script>
