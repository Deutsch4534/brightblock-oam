<template>
  <mdb-container fluid class="bg-light flex-1 py-5">
    <mdb-container class="py-3 py-md-4">
      <mdb-row v-if="noartworks">
        <div class="col-12 mb-5">
          <p class="h1-responsive mb-5">No artworks found in your portfolio!</p>
          <p><router-link to="/my-artwork/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Artwork</router-link> to get started...</p>
        </div>
      </mdb-row>
      <mdb-row v-else>
      <router-view/>
        <div class="col-12 mb-5" v-if="numberArtworksSelling">
          <h1 class="h1-responsive mb-5">Artworks Selling <span>({{numberArtworksSelling}})</span></h1>
        </div>
        <div class="col-12">
          <my-artworks-list :artworks="selling"/>
        </div>

        <div class="col-12 mb-5" v-if="numberArtworksBuying">
          <h1 class="h1-responsive mb-5">Artworks Buying <span>({{numberArtworksBuying}})</span></h1>
        </div>
        <div class="col-12">
          <my-artworks-list :artworks="buying"/>
        </div>

        <div class="col-12 mb-5">
          <h1 class="h1-responsive mb-5">Artworks <span>({{numberArtworksUnsold}})</span></h1>
        </div>
        <div class="col-12">
          <my-artworks-list :artworks="unsold" />
        </div>

        <div class="col-12 mb-5">
          <h2 class="h1-responsive mb-5">Sold Artworks <span>({{numberArtworksSold}})</span></h2>
        </div>
        <div class="col-12">
          <my-artworks-list :artworks="sold"/>
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
  created() {
    this.$store.dispatch("myArtworksStore/fetchMyArtworks");
  },
  methods: {},
  computed: {
    unsold() {
      return this.$store.getters["myArtworksStore/unsold"];
    },
    selling() {
      return this.$store.getters["myArtworksStore/selling"];
    },
    sold() {
      return this.$store.getters["myArtworksStore/sold"];
    },
    buying() {
      return this.$store.getters["myArtworksStore/buying"];
    },
    numberArtworksBuying() {
      return this.$store.getters["myArtworksStore/buying"].length;
    },
    numberArtworksSelling() {
      return this.$store.getters["myArtworksStore/selling"].length;
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
