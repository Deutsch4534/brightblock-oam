<template>
  <mdb-container fluid class="bg-light flex-1">
    <mdb-container class="py-5">
      <mdb-row v-if="noartworks">
        <div class="col-12 mb-5">
          <p class="h2-responsive mb-5">No artworks found in your portfolio!</p>
          <p><router-link to="/my-artwork/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Artwork</router-link> to get started...</p>
        </div>
      </mdb-row>
      <mdb-row v-else>
      <router-view/>
        <div class="col-12 mb-5">
          <h2 class="h2-responsive mb-5">Artworks <span>({{numberArtworksUnsold}})</span></h2>
        </div>
        <div class="col-12">
          <my-artworks-list :artworks="unsold" :sold="false" :show-load-button="false" :chunks="6"/>
        </div>
        <div class="col-12 mb-5">
          <h2 class="h2-responsive mb-5">Sold Artworks <span>({{numberArtworksSold}})</span></h2>
        </div>
        <div class="col-12">
          <my-artworks-list :artworks="sold" :sold="true" :show-load-button="false" :chunks="6"/>
        </div>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import MyArtworksList from "./components/myArtwork/MyArtworksList";
import { mdbContainer, mdbRow,  mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworks",
  bodyClass: "index-page",
  components: {
    MyArtworksList,
    mdbContainer,
    mdbRow,
     mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn
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
    },
    noartworks() {
      return (this.$store.getters["myArtworksStore/numberArtworksUnsold"] + this.$store.getters["myArtworksStore/numberArtworksSold"]) === 0;
    }
  }
};
</script>
