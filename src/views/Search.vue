<template>
<div class="wrapper">
  <leafs/>
  <div class="main main-raised">
    <div class="section section-basic">
      <div class="container">
        <h1 class="innerpage mb-0">Search results for: {{ queryString }} ({{numberArtworks}})</h1>
        <results-list :artworks="artworks" :show-load-button="false" :chunks="6"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ResultsList from "./components/search/ResultsList";
import Leafs from "./components/Leafs";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Search",
  bodyClass: "index-page",
  components: {
    ResultsList,
    Leafs
  },
  data() {
    return {
      queryString:
        this.$route && this.$route.params.query
          ? parseInt(this.$route.params.query)
          : undefined
    };
  },
  created() {
    this.queryString = this.$route.query.query;
    if (!this.queryString) {
      this.queryString = "*";
    }
    this.$store.dispatch(
      "artworkSearchStore/fetchSearchResults",
      { term: "title", query: this.queryString },
      { root: true }
    );
  },
  methods: {},
  computed: {
    artworks() {
      return this.$store.getters["artworkSearchStore/getSearchResults"];
    },
    numberArtworks() {
      return this.$store.getters["artworkSearchStore/numberSearchResults"];
    }
  }
};
</script>
