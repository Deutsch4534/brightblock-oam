<template>
<div class="container">
  <div class="md-layout">
    <div class="md-layout-item md-size-50">
      <md-card>
        <md-card-header>webcast auctions</md-card-header>
        <md-card-content>
          <single-auction v-for="(auction, index) of webcastAuctions" :key="index" :auction="auction"/>
        </md-card-content>
      </md-card>
    </div>
    <div class="md-layout-item md-size-50">
      <md-card>
        <md-card-header>sealed auctions</md-card-header>
        <md-card-content>
          <single-auction v-for="(auction, index) of sealedAuctions" :key="index" :auction="auction"/>
        </md-card-content>
      </md-card>
    </div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-50">
      <md-card>
        <md-card-header>past auctions</md-card-header>
        <md-card-content>
          <single-auction v-for="auction of pastAuctions" :key="auction.auctionId" :auction="auction"/>
        </md-card-content>
      </md-card>
    </div>
  </div>
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
    webcastAuctions() {
      return this.$store.getters["onlineAuctionsStore/webcastAuctions"];
    },
    sealedAuctions() {
      return this.$store.getters["onlineAuctionsStore/sealedAuctions"];
    },
    pastAuctions() {
      return this.$store.getters["onlineAuctionsStore/pastAuctions"];
    }
  }
};
</script>
