<template>
<mdb-container fluid class="bg-dark flex-1 py-5">
  <mdb-container class="py-3 py-md-4">
    <div class="row">
      <div class="col-4">
        <h1 class="h1-responsive mb-5 text-white">{{numberArtworks}} Results</h1>
        <h2 class="h2-responsive mb-3 text-white">Refine search</h2>
        <filters @doSearch="doSearch($event)" class="text-white mb-5"/>
      </div>
      <div class="col-8">
        <div class="row article" v-if="objectType === 'artwork'">
          <single-result v-for="(artwork, index) of searchResults" :key="index" :artwork="artwork" class="result-item"/>
        </div>
        <div class="row article" v-if="objectType === 'gallery'">
          <single-result-gallery v-for="(gallery, index) of searchResults" :key="index" :gallery="gallery" class="result-item"/>
        </div>
        <div class="row article" v-if="objectType === 'auction'">
          <single-result-auction v-for="(auction, index) of searchResults" :key="index" :auction="auction" class="result-item"/>
      </div>
      </div>
    </div>
  </mdb-container>
</mdb-container>
</template>

<script>
import SingleResult from "./components/search/SingleResult";
import SingleResultGallery from "./components/search/SingleResultGallery";
import SingleResultAuction from "./components/search/SingleResultAuction";
import Filters from "./components/search/Filters";
import searchIndexService from "../services/searchIndexService";
import artworkSearchService from "@/services/artworkSearchService";
import { mdbContainer, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Search",
  bodyClass: "index-page",
  components: {
    SingleResult, SingleResultGallery, SingleResultAuction,
    Filters,
    mdbContainer,
    mdbRow,
  },
  data() {
    return {
      results: [],
      objectType: "artwork",
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
    doSearch(criteria) {
      let qString = this.query;
      if (!this.query || this.query.length === 0) {
        qString = "*";
      }
      if (!criteria.objectType) {
        criteria.objectType = "artwork";
      }
      this.objectType = criteria.objectType;
      if (criteria.objectType === "artwork") {
        artworkSearchService.newQuery({field: "title", query: qString});
      } else if (criteria.objectType === "auction") {
      } else if (criteria.objectType === "gallery") {
        this.$store.dispatch("galleryStore/fetchGalleriesFromSearch", {field: "title", query: qString});
      }
      this.$router.push("/search?query=" + qString);
    },
  },
  computed: {
    numberArtworks() {
      if (this.objectType === "artwork") {
        return this.$store.getters["artworkSearchStore/numberSearchResults"];
      } else if (this.objectType === "auction") {
        //return this.$store.getters["artworkSearchStore/getSearchResults"].length;
      } else if (this.objectType === "gallery") {
        return this.$store.getters["galleryStore/getSearchResults"].length;
      }
    },
    searchResults() {
      if (this.objectType === "artwork") {
        return this.$store.getters["artworkSearchStore/getSearchResults"];
      } else if (this.objectType === "auction") {
        //return this.$store.getters["artworkSearchStore/getSearchResults"];
      } else if (this.objectType === "gallery") {
        return this.$store.getters["galleryStore/getSearchResults"];
      }
    }
  }
};
</script>
<style scoped>
.article {
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: flex-start;
}
</style>
