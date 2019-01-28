<template>
<mdb-container class="mt-1">
  <div class="row">
    <div class="md-col-4 mr-5">
      <h2 class="mb-5">Refine search</h2>
      <filters @update="updateFilters($event)"/>
    </div>
    <div class="md-col-8">
      <!-- Supported elements -->
      <h2 class="mb-5">{{numberArtworks}} found..</h2>
      <hr class="my-5">
      <ul class="list-unstyled">
        <single-result v-for="(artwork, index) of searchResults" :key="index" :artwork="artwork"/>
      </ul>
    </div>
  </div>
</mdb-container>
</template>

<script>
import SingleResult from "./components/search/SingleResult";
import Filters from "./components/search/Filters";
import searchIndexService from "../services/searchIndexService";
import artworkSearchService from "@/services/artworkSearchService";
import { mdbContainer, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Search",
  bodyClass: "index-page",
  components: {
    SingleResult,
    Filters,
    mdbContainer,
    mdbRow,
  },
  data() {
    return {
      results: [],
      queryString:
        this.$route && this.$route.params.query
          ? parseInt(this.$route.params.query)
          : undefined
    };
  },
  mounted() {
    this.queryString = this.$route.query.query;
    if (!this.queryString) {
      this.queryString = "*";
    }
    artworkSearchService.newQuery(this.queryString);
    /**
    this.$store.dispatch(
      "artworkSearchStore/fetchSearchResults",
      { term: "title", query: this.queryString },
      { root: true }
    );
    **/
  },
  methods: {
  },
  computed: {
    numberArtworks() {
      return this.$store.getters["artworkSearchStore/numberSearchResults"];
    },
    searchResults() {
      return this.$store.getters["artworkSearchStore/getSearchResults"];
    }
  }
};
</script>
