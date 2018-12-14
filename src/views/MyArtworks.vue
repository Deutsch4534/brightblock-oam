<template>
<div class="wrapper">
  <leafs/>
  <div class="main main-raised">
    <div class="section section-basic">
      <div class="container">
        <div id="images">
          <div class="title">
            <h2>Artworks <span>(Artworks: {{numberArtworksUnsold}})</span></h2>
          </div>
          <my-artworks-list :artworks="unsold" :sold="false" :show-load-button="false" :chunks="6"/>
          <div class="title">
            <h2>Sold Artworks <span>Artworks sold: {{numberArtworksSold}}</span></h2>
          </div>
          <my-artworks-list :artworks="sold" :sold="true" :show-load-button="false" :chunks="6"/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MyArtworksList from "./components/myArtwork/MyArtworksList";
import Leafs from "./components/Leafs";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworks",
  bodyClass: "index-page",
  components: {
    MyArtworksList,
    Leafs
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
