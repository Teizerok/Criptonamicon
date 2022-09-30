<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер
        </label>
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            @keydown.enter="addTicker"
            v-model.trim="ticker"
            type="text"
            name="wallet"
            id="wallet"
            class="
              block
              w-full
              pr-10
              border-gray-300
              text-gray-900
              focus:outline-none focus:ring-gray-500 focus:border-gray-500
              sm:text-sm
              rounded-md
            "
            placeholder="Например BTC"
          />
        </div>
        <div
          v-if="ticker.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="ticker of autoCompleteList"
            :key="ticker"
            @click="addFromAutoComlete(ticker)"
            class="
              inline-flex
              items-center
              px-2
              m-1
              rounded-md
              text-xs
              font-medium
              bg-gray-300
              text-gray-800
              cursor-pointer
            "
          >
            {{ ticker.Symbol }}
          </span>
        </div>
        <div v-if="!noRepeated" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
        <add-button :disabled="disabled" @click="addTicker" class="my-4" />
      </div>
    </div>
  </section>
</template>



<script>
import addButton from "./addButton.vue";

export default {
  components: {
    addButton,
  },

  props: {
    autoComplete: {
      type: Function,
      required: false,
      default: () => {},
    },

    tickersList: {
      type: Array,
      required: false,
      default: [],
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: {
    addTicker: (value) => typeof value === "object" && value.name.length > 0,
  },

  data() {
    return {
      ticker: "",
    };
  },

  computed: {
    noRepeated() {
      return this.tickersList.every(
        (ticker) => ticker.name !== this.ticker.toUpperCase()
      );
    },

    autoCompleteList() {
      const regular = this.ticker.toUpperCase();
      return this.autoComplete(regular);
    },
  },

  methods: {
    addTicker() {
      if (!this.noRepeated || this.ticker.length === 0 || this.disabled) return;

      const correctName = this.ticker.toUpperCase();

      const currentTicker = {
        name: correctName,
        price: "-",
        isHasTicker: true,
      };

      this.ticker = "";
      this.$emit("addTicker", currentTicker);
    },

    addFromAutoComlete(t) {
      this.ticker = t.Symbol;
      this.addTicker();
    },
  },
};
</script>
