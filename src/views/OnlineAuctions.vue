<template>
<mdb-container>
  <mdb-row v-if="auctionsSize > 0">
    <div class="col-md-12"><h2>Auctions</h2></div>
    <single-auction v-for="(auction, index) of onlineAuctions" :key="index" :auction="auction"/>
  </mdb-row>
  <hr/>
  <mdb-row v-if="auctionsArchiveSize > 0">
    <div class="col-md-12"><h2>Archives</h2></div>
    <single-auction v-for="(auction, index) of pastAuctions" :key="index" :auction="auction" :atype="'archive'"/>
  </mdb-row>
</mdb-container>
</template>

<script>
import SingleAuction from "./components/auction/SingleAuction";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbContainer, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OnlineAuctions",
  bodyClass: "index-page",
  components: {
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
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("onlineAuctionsStore/fetchOnlineAuctions").then(() => {
      // loading online auctions
    });
  },
  methods: {},
  computed: {
    auctionsSize() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"].length;
    },
    auctionsArchiveSize() {
      return this.$store.getters["onlineAuctionsStore/pastAuctions"].length;
    },
    onlineAuctions() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"];
    },
    pastAuctions() {
      return this.$store.getters["onlineAuctionsStore/pastAuctions"];
    }
  }
};
</script>
