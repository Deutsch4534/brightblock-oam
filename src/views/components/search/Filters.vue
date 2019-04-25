<template>
  <div id="filter-art md-form search-form">
    <div class="row text-right mb-4">
        <div class="col-12"><a @click.prevent="clearSearch">clear search</a></div>
    </div>
    <div class="form-row mb-4">
      <select @change="updateSearch" class="text-black browser-default custom-select custom-select-md mb-3" v-model="objectType">
        <option value="" :disabled="true">Search For..</option>
        <option value="artwork">Search For Artwork</option>
        <option value="gallery">Search For Galleries</option>
        <option value="auction">Search For Auctions</option>
      </select>
    </div>
    <div class="form-row mb-4">
      <div class="col-sm-10">
        <input  v-on:keyup.13.prevent="findBySearchTerm" type="text" class="query-field p-2 form-control" v-model="query" placeholder="Search"/>
      </div>
      <div class="col-sm-2">
        <a @click.prevent="findBySearchTerm"><mdb-icon icon="search" class="teal-text mt-3" style="line-height: 10px;" aria-hidden="true" size="2x"/></a>
      </div>
    </div>
    <div class="form-row mb-2" style="border-bottom: 1pt solid #ccc">
      <h6>Tags</h6>
    </div>
    <div class="form-row mb-5">
      <div>
        <span v-for="keyword in filters.keywords" :key="keyword" class="px-1"><a @click.prevent="findByKeyword(keyword)"><mdb-btn rounded :color="keywordSelected(keyword)" size="sm" class="mx-0 waves-light"><small>{{keyword}}</small></mdb-btn></a></span>
      </div>
    </div>
    <div class="form-row mb-5">
        <select class="text-black browser-default custom-select custom-select-md mb-3" v-model="medium" v-on:change="findByMedium">
          <option>Any Medium</option>
          <option v-for="(medium) in filters.media" :key="medium.value" :value="medium.value">{{medium.label}}</option>
        </select>
    </div>
  <!--
    <div class="hr-spacer"></div>
    <div id="priceRange">
      <span class="left">Price</span>
      <span class="right">€ {{ filters.price }}-50.000 </span>
      <br/>
      <input type="range" min="0" max="1000" step="1" class="slider" @change="updateFilter()" v-model="filters.price">
    </div>
    -->
  </div>
</template>

<script>
import { mdbIcon, mdbSelect, mdbBtn } from 'mdbvue';
import _ from "lodash";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Filters',
  components: { mdbIcon, mdbSelect, mdbBtn },
  data () {
    return {
      filters: {
        type: null,
        auction: false,
        keywords: this.$store.state.constants.taxonomy.keywords,
        media: this.$store.state.constants.taxonomy.media,
        price: 0
      },
      query: null,
      keywords: [],
      medium: "Any Medium",
      objectType: "artwork"
    }
  },
  methods: {
    updateSearch (cause) {
      let query = [];
      if (this.query) {
        query.push("(title:" + this.query + " OR description:" + this.query + ")");
      } else if (cause === "findBySearchTerm") {
        //query.push("");
      }
      if (this.keywords.length > 0) {
        query.push("(keywords:" + this.keywords + ")");
      }
      if (this.medium && this.medium !== "Any Medium") {
        query.push("(medium:" + this.medium + ")");
      }
      let myQuery = (query.length > 0) ? query.join(" AND ") : "";
      let criteria = {
        field: "facet",
        query: myQuery,
        objectType: this.objectType
      }
      this.$emit("doSearch", criteria);
    },
    findBySearchTerm () {
      this.updateSearch("findBySearchTerm");
    },
    findByMedium () {
      this.updateSearch();
    },
    findByKeyword: function(keyword) {
      let index = _.findIndex(this.keywords, function(o) {
        return o === keyword;
      });
      if (index === -1) {
        this.keywords.push(keyword);
      } else {
        this.keywords.splice(index, 1);
      }
      this.updateSearch();
    },
    clearSearch: function() {
      this.query = null;
      this.keywords = [];
      this.medium = "Any Medium";
      this.updateSearch();
    },
    keywordSelected(kw) {
      if (this.keywords.join(" ").indexOf(kw) > -1) {
        return "purple";
      }
      return "white";
    }
  },
  computed: {
  }
}
</script>
<style scoped>
.query-field {
  color: black;
  font-size: 1.3em;
  text-transform: capitalize;
}
</style>
