<template>
<div class="container">
  <mdb-row v-if="auctionsSize > 0 && featureAuctions">
    <div class="col-md-12"><h5>Featured Auctions</h5></div>
    <single-auction v-for="(auction, index) of onlineAuctions" :key="index" :auction="auction"/>
  </mdb-row>
  <hr/>
  <h5>Featured Artworks</h5>
  <last-artworks :artworks="artworks" class=""/>
</div>
</template>

<script>
import LastArtworks from "./components/home/LastArtworks";
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
    SingleAuction
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
.section-download {
  .btn + .btn {
    margin-left: 5px;
  }
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
