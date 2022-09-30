<template>
  <section>
    <button-move v-if="page > 1" @click="page--">Назад</button-move>

    <button-move v-if="isNextPage" @click="page++">Вперед</button-move>

    <p>Фильтр:</p>

    <input
      v-model="filter"
      class="
        block
        pr-10
        border-gray-300
        text-gray-900
        focus:outline-none focus:ring-gray-500 focus:border-gray-500
        sm:text-sm
        rounded-md
      "
      type="text"
    />
  </section>
</template>



<script>
import { getURL } from "../url-api.js";
import buttonMove from "./buttonMove.vue";

export default {
  components: {
    buttonMove,
  },

  props: {
    filter: {
      type: String,
      default: "",
    },
    page: {
      type: Number,
      default: 1,
    },
    isNextPage: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  emits: {
    "updade:page": (value) => typeof value === "number",
    "updade:filter": (value) => typeof value === "string",
  },

  data() {
    return {
      page: 1,
      filter: "",
    };
  },

  watch: {
    page(newValue) {
      this.$emit("update:page", newValue);
    },

    filter(newValue) {
      this.$emit("update:filter", newValue);
      this.page = 1;
    },
  },

  created() {
    this.page = getURL("page") || 1;
    this.filter = getURL("filter") || "";
  },
};
</script>