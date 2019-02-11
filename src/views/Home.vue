<template>
  <mdb-container fluid class="bg-light flex-1">
    <mdb-container class="py-5">
      <mdb-row v-if="auctionsSize > 0 && featureAuctions">
        <div class="col-12">
          <h2 class="h2-responsive mb-5">Featured Auctions</h2>
        </div>
          <single-auction v-for="(auction, index) of onlineAuctions" :key="index" :auction="auction" class="col-sm-6 col-mb-4 col-lg-3"/>
      </mdb-row>
      <mdb-row>
        <div class="col-12">
          <h2 class="h2-responsive mb-5">Featured Artworks</h2>
        </div>
        <last-artwork v-for="(artwork, index) in artworks" :key="index" :artwork="artwork" class="col-sm-6 col-md-4 col-lg-3"/>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import LastArtworks from "./components/home/LastArtworks";
import LastArtwork from "./components/home/LastArtwork";
import SingleAuction from "./components/auction/SingleAuction";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbContainer, mdbRow } from 'mdbvue';

export default {
  components: {
    LastArtworks,
    mdbContainer,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    SingleAuction,
    LastArtwork
  },
  name: "home",
  bodyClass: "index-page",
  props: {
    image: {
      type: String,
      default: require("@/assets/img/vue-mk-header.jpg")
    },
    signup: {
      type: String,
      default: require("@/assets/img/city.jpg")
    }
  },
  data() {
    return {
      firstname: null,
      email: null,
      password: null
    };
  },
  created() {
    this.$store.dispatch("onlineAuctionsStore/fetchOnlineAuctions").then(() => {
      // loading online auctions
    });
  },
  methods: {},
  computed: {
    artworks() {
      return this.$store.getters["artworkSearchStore/homePageArtworks"];
    },
    auctionsSize() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"].length;
    },
    featureAuctions() {
      return this.$store.state.constants.featureAuctions;
    },
    onlineAuctions() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"];
    }
  },
  mounted() {}
};
</script>
<style>
/* .section-download {
  .btn + .btn {
    margin-left: 5px;
  }
} */

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
