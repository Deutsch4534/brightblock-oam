<template>
<div class="container">
  <div class="title">
    <h2>Upcoming Auctions ({{auctionsSize}})</h2>
  </div>
  <single-auction v-for="(auction, index) of auctions" :key="index" :auction="auction"/>
  <div class="title">
    <h2>Past Auctions</h2>
  </div>
  <single-auction v-for="auction of pastAuctions" :key="auction.auctionId" :auction="auction"/>
</div>
</template>

<script>
import SingleAuction from "./components/auction/SingleAuction";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OnlineAuctions",
  bodyClass: "index-page",
  components: { SingleAuction },
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
    auctions() {
      return this.$store.getters["onlineAuctionsStore/onlineAuctions"];
    },
    pastAuctions() {
      return this.$store.getters["onlineAuctionsStore/pastAuctions"];
    }
  }
};
</script>
