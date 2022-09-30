<template>
  <section v-if="select" class="relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ select }} -
      {{ currencyExemple }}
    </h3>

    <div
      class="flex items-end border-gray-600 border-b border-l h-64"
      ref="graph"
    >
      <div
        ref="bar"
        v-for="(bar, i) of normalizedGraph"
        :key="i"
        :style="{ height: `${bar}%` }"
        class="bg-purple-800 border w-8"
      ></div>
    </div>
    <close-graph-button @close="$emit('update:select', '')" />
  </section>
</template>

<script>
import closeGraphButton from "./closeGraphButton.vue";

export default {
  components: {
    closeGraphButton,
  },

  data() {
    return {
      widthBar: null,
      currencyExemple: "USD",
    };
  },

  props: {
    select: {
      type: String,
      required: true,
      default: "",
    },
    normalizedGraph: {
      type: Array,
      required: true,
      default: [],
    },
    maxElementGraph: {
      type: Number,
      required: true,
      default: 1,
    },
  },

  emits: {
    "update:maxElementGraph": null,
    "update:select": null,
  },

  methods: {
    calculateElementGraph() {
      if (!this.$refs.bar || !this.$refs.graph) {
        setTimeout(this.calculateElementGraph, 500);
        return;
      }

      if (!this.widthBar) {
        this.widthBar = this.$refs.bar[0].clientWidth;
      }

      const maxElementGraph = this.$refs.graph.clientWidth / this.widthBar;
      this.$emit("update:maxElementGraph", maxElementGraph);
    },
  },

  mounted() {
    this.$nextTick().then(this.calculateElementGraph);
    window.addEventListener("resize", this.calculateElementGraph);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateElementGraph);
  },
};
</script>

