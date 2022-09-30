<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <add-ticker-section
        @add-ticker="addTicker"
        :auto-complete="autoComplete"
        :tickers-list="tickers"
        :disabled="disabled"
      />

      <hr class="w-full border-t border-gray-600 my-4" />

      <filter-section
        v-model:page="page"
        v-model:filter="filter"
        :is-next-page="isNextPage"
      />

      <tickers-section
        @delete="remove"
        v-model:select="select"
        :paginated-tickers="paginated"
        :is-has-tickers="isHasTickers"
      />

      <graph-section
        v-if="select"
        @new-params-graph="updateGraphParam"
        v-model:select="select"
        v-model:max-element-graph="maxElementGraph"
        :normalized-graph="normalizedGraph"
      />
    </div>
  </div>
</template>

<script>
import {
  autoCompleateLoader,
  subsribeToUpdate,
  unsubsribeToUpdate,
} from "./api.js";

import { getStorage, setStorage } from "./storage-api.js";
import { pushURL } from "./url-api.js";

import addTickerSection from "./components/addTickerSection.vue";
import filterSection from "./components/filterSection.vue";
import tickersSection from "./components/tickersSection.vue";
import graphSection from "./components/graphSection.vue";

export default {
  name: "App",
  components: {
    addTickerSection,
    filterSection,
    tickersSection,
    graphSection,
  },

  data() {
    return {
      filter: "",
      select: "",

      tickers: [],
      graph: [],
      autoCompleteList: [],

      page: 1,
      maxElementGraph: 1,
      maxTickersElements: 50,
      maxTickersElementsPage: 6,
    };
  },

  computed: {
    //? computed for components -------------------------------------------

    disabled() {
      return this.tickers.length >= this.maxTickersElements;
    },
    isNextPage() {
      return (
        this.filteredArray.length > this.page * this.maxTickersElementsPage
      );
    },

    paginated() {
      return this.filteredArray.slice(this.startIndex, this.endIndex);
    },

    isHasTickers() {
      return this.tickers.length > 0;
    },

    normalizedGraph() {
      if (this.standartedGraph) {
        return this.graph.map(() => 50);
      }
      return this.graph.map(
        (bar) =>
          5 + ((bar - this.minGraph) * 95) / (this.maxGraph - this.minGraph)
      );
    },
    //?---------------------------------------------------------------------

    maxGraph() {
      return Math.max(...this.graph);
    },
    minGraph() {
      return Math.min(...this.graph);
    },

    standartedGraph() {
      return this.maxGraph === this.minGraph;
    },

    filteredArray() {
      return this.tickers.filter((t) =>
        t.name.includes(this.filter.toUpperCase())
      );
    },

    startIndex() {
      return this.maxTickersElementsPage * (this.page - 1);
    },

    endIndex() {
      return this.maxTickersElementsPage * this.page;
    },

    urlChangedData() {
      return {
        page: this.page,
        filter: this.filter,
      };
    },

    startGrahElement() {
      return this.graph.length - this.maxElementGraph;
    },
  },

  methods: {
    addTicker(ticker) {
      this.tickers = [...this.tickers, ticker];
      this.filter = "";

      subsribeToUpdate(ticker.name, (price, isHasTicker) => {
        this.subscribeUpdate(ticker.name, price, isHasTicker);
      });
    },

    autoComplete(regularTiker) {
      return this.autoCompleteList
        .filter(
          (i) =>
            i.Symbol.includes(regularTiker) || i.FullName.includes(regularTiker)
        )
        .slice(0, 4);
    },

    remove(deleteElement) {
      this.tickers = this.tickers.filter(
        (element) => element.name !== deleteElement
      );
      unsubsribeToUpdate(deleteElement);
    },

    subscribeUpdate(nameTicker, price, isHasTicker) {
      const curencyTicker = this.tickers.find((t) => t.name === nameTicker);

      curencyTicker.price = price;
      curencyTicker.isHasTicker = isHasTicker;

      if (this.select === nameTicker) {
        this.graph.push(price);
        this.clearGraph();
      }
    },

    clearGraph() {
      if (this.graph.length > this.maxElementGraph) {
        this.graph = this.graph.slice(this.startGrahElement);
      }
    },
  },
  watch: {
    select() {
      this.graph = [];
    },
    maxElementGraph() {
      this.clearGraph();
    },

    paginated() {
      if ([...this.paginated].length === 0 && this.page > 1) this.page--;
    },
    tickers() {
      setStorage("crypto-list", this.tickers);
    },

    urlChangedData() {
      pushURL(this.filter, this.page);
    },
  },

  created: async function () {
    const storageData = getStorage("crypto-list");

    if (storageData) {
      this.tickers = storageData;
      this.tickers.forEach((t) =>
        subsribeToUpdate(t.name, (price, isHasTicker) => {
          this.subscribeUpdate(t.name, price, isHasTicker);
        })
      );
    }

    this.autoCompleteList = await autoCompleateLoader();
  },
};
</script>






