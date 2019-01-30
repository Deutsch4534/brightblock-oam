<template>
<div class="container" v-if="'0 = unsold + sold'">
  <p>No artworks found in you're portfolio!</p>
  <p><router-link to="/my-artwork/upload">Upload Artwork</router-link> to get started...</p>
</div>
<div class="container" v-else>
  <router-view/>
  <div class="title my-5">
    <h2>Artworks <span>({{numberArtworksUnsold}})</span></h2>
  </div>
  <my-artworks-list :artworks="unsold" :sold="false" :show-load-button="false" :chunks="6"/>
  <div class="title my-5">
    <h2>Sold Artworks <span>({{numberArtworksSold}})</span></h2>
  </div>
  <my-artworks-list :artworks="sold" :sold="true" :show-load-button="false" :chunks="6"/>
</div>
</template>

<script>
import MyArtworksList from "./components/myArtwork/MyArtworksList";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworks",
  bodyClass: "index-page",
  components: {
    MyArtworksList
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  computed: {
    unsold() {
      return this.$store.getters["myArtworksStore/unsold"];
    },
    sold() {
      return this.$store.getters["myArtworksStore/sold"];
    },
    numberArtworksSold() {
      return this.$store.getters["myArtworksStore/numberArtworksSold"];
    },
    numberArtworksUnsold() {
      return this.$store.getters["myArtworksStore/numberArtworksUnsold"];
    }
  }
};
</script>
