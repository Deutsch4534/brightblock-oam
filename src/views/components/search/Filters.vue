<template>
  <div id="filter-art">
    <form class="md-form search-form ml-2" @submit.prevent="">
      <div class="form-row mb-5">
        <select @change="doSearch" class="text-black browser-default custom-select custom-select-lg mb-3" v-model="objectType">
          <option value="" :disabled="true">Search For..</option>
          <option value="artwork">Radicle Artwork</option>
          <option value="gallery">Radicle Galleries</option>
          <option value="auction">Radicle Auctions</option>
        </select>
      </div>
      <div class="form-row">
        <input @change="doSearch" type="text" class="form-control" id="vcSearchQuery" v-model="query" placeholder="Search" v-on:keyup.13="doSearch"/>
      </div>
    </form>
  <!--
    <ul>
      <li data-type-filter="all" class="active">All Types</li>
      <li data-type-filter="photography">Photography</li>
      <li data-type-filter="illustration">Illustration</li>
      <li data-type-filter="3d">3D</li>
      <li data-type-filter="2d">2D</li>
      <li data-type-filter="film">Film & Video</li>
      <li data-type-filter="mix-media">Mix-media</li>
    </ul>
    <div class="hr-spacer"></div>
    <div id="auction-container">
      <input type="checkbox" id="auction" name="auction" :value="filters.auction" @change="updateFilter()" />
      <label for="auction">Auction</label>
    </div>
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
import { mdbIcon, mdbSelect } from 'mdbvue';
// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Filters',
  components: { mdbIcon, mdbSelect },
  data () {
    return {
      filters: {
        type: null,
        auction: false,
        price: 0
      },
      query: "",
      objectType: "artwork"
    }
  },
  methods: {
    updateFilter () {
      this.$emit('update', this.filters);
    },
    doSearch() {
      this.$emit("doSearch", {
        query: this.query,
        objectType: this.objectType
      });
    }
  },
  computed: {
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    url() {
      return `/artworks/${this.artwork.id}`;
    }
  }
}
</script>
