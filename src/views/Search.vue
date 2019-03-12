<template>
<mdb-container fluid class="bg-dark flex-1 py-5">
  <mdb-container class="py-3 py-md-4">
    <div class="row">
      <div class="col-12">
        <h1 class="h1-responsive mb-5 text-white">Search results ({{numberArtworks}})</h1>
        <!--<h2 class="h2-responsive mb-3 text-white">Refine search</h2>
        <filters @update="updateFilters($event)" class="text-white mb-5"/>-->
      </div>
    </div>
      <div class="row article">
        <single-result v-for="(artwork, index) of searchResults" :key="index" :artwork="artwork" class="result-item"/>
       </div>
  </mdb-container>
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
    artworkSearchService.newQuery({field: "title", query: this.queryString});
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
<style scoped>
.article {
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: center;
}
</style>
