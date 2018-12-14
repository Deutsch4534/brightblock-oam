<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-sm-12 pt-5">
          <h1 class="innerpage">Artworks <span>(Artworks: {{numberArtworksUnsold}})</span></h1>
          <my-artworks-list :artworks="unsold" :sold="false" :show-load-button="false" :chunks="6"/>
          <h1 class="innerpage mt-50">Sold Artworks <span>Artworks sold: {{numberArtworksSold}}</span></h1>
          <my-artworks-list :artworks="sold" :sold="true" :show-load-button="false" :chunks="6"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MyArtworksList from "./components/myArtwork/MyArtworksList";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworks",
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
