<template>
<mdb-container fluid class="bg-dark flex-1 py-5">
  <mdb-container fluid class="py-3">
    <div class="row">
      <div class="col-md-3 col-sm-12">
        <h2 class="h2-responsive mb-3 mx-5 text-white">Search Radicle</h2>
        <h4 class="h4-responsive mb-2 mx-5 text-white">{{numberArtworks}} Results</h4>
        <filters @doSearch="doSearch($event)" class="text-white mx-5"/>
      </div>
      <div class="col-md-9 col-sm-12">
        <div class="row article" v-if="objectType === 'artwork'">
          <single-result-artwork v-for="(artwork, index) of searchResults" :key="index" :artwork="artwork" class="result-item"/>
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
import SingleResultArtwork from "./components/search/SingleResultArtwork";
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
    SingleResultArtwork, SingleResultGallery, SingleResultAuction,
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
      if (!criteria.objectType) {
        criteria.objectType = "artwork";
      }
      //if (!criteria.query) {
      //  criteria.query = "*";
      //}
      if (!criteria.field) {
        criteria.field = "title";
      }
      this.objectType = criteria.objectType;
      if (criteria.objectType === "artwork") {
        artworkSearchService.newQuery({field: criteria.field, query: criteria.query});
      } else if (criteria.objectType === "auction") {
      } else if (criteria.objectType === "gallery") {
        this.$store.dispatch("galleryStore/fetchGalleriesFromSearch", {field: "title", query: criteria.query});
      }
      // this.$router.push("/search?query=" + criteria.query);
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
@media (max-width: 900px) {
  .article {
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-content: center;
  }
}
</style>
