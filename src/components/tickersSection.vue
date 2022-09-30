
<template>
  <temlate v-if="isHasTikers">
    <hr class="w-full border-t border-gray-600 my-4" />
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div
        v-for="ticker of paginatedTickers"
        :key="ticker.name"
        @click="selectItem(ticker)"
        :class="{
          'border-4': select === ticker.name,
          'bg-red-200': !ticker.isHasTicker,
        }"
        class="
          overflow-hidden
          shadow
          rounded-lg
          border-purple-800 border-solid
          cursor-pointer
        "
      >
        <div class="px-4 py-5 sm:p-6 text-center">
          <dt class="text-sm font-medium text-gray-500 truncate">
            {{ ticker.name }} -
            {{ currencyExemple }}
          </dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {{ formatPrice(ticker.price) }}
          </dd>
        </div>
        <div class="w-full border-t border-gray-200"></div>
        <button-delete-ticker
          @delete-tiker="remove(ticker.name)"
          :ticker-name="ticker.name"
          class="px-4 py-4"
        />
      </div>
    </dl>
    <hr class="w-full border-t border-gray-600 my-4" />
  </temlate>

  <template v-else>
    <p>Тикеров пока нет.</p>
  </template>
</template>

<script>
import buttonDeleteTicker from "./buttonDeleteTicker.vue";
export default {
  components: {
    buttonDeleteTicker,
  },

  data() {
    return {
      currencyExemple: "USD",
    };
  },

  props: {
    isHasTikers: {
      type: Number,
      required: true,
      default: 1,
    },
    paginatedTickers: {
      type: Array,
      required: true,
      default: [],
    },
    select: {
      type: String,
      required: true,
      default: "",
    },
  },

  emits: {
    "update:select": null,
    delete: null,
  },

  methods: {
    remove(deleteElement) {
      if (this.select === deleteElement) this.$emit("update:select", null);
      this.$emit("delete", deleteElement);
    },

    selectItem(currentTicker) {
      this.$emit("update:select", currentTicker.name);
    },

    formatPrice(tickerPrice) {
      if (tickerPrice === "-") return tickerPrice;

      return tickerPrice > 1
        ? tickerPrice.toFixed(2)
        : tickerPrice.toPrecision(2);
    },
  },
};
</script>