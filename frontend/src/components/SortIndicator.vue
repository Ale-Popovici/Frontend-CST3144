<template>
  <div class="flex items-center text-sm text-gray-600 mt-2">
    <i class="fas fa-info-circle mr-2"></i>
    <span>
      Sorted by: <strong>{{ formatAttribute(attribute) }}</strong> in
      <strong>{{ order ? "ascending" : "descending" }}</strong> order
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
    },
    order: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    formatAttribute(attr) {
      return attr.charAt(0).toUpperCase() + attr.slice(1);
    },
  },
};
</script>
