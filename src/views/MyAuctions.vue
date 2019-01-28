<template>
<div class="container">
  <router-view/>
  <div class="title">
    <h2>My Auctions <span>({{myAuctionsFutureCount}})</span></h2>
  </div>
  <single-auction v-for="(auction, index) of myAuctionsFuture" :key="index" :auction="auction" :atype="'webcast'"/>
  <div class="title">
    <h2>Archived <span>({{myAuctionsPastCount}})</span></h2>
  </div>
  <single-auction v-for="(auction, index) of myAuctionsPast" :key="index" :auction="auction" :atype="'archive'"/>
</div>
</template>

<script>
import utils from "@/services/utils";
import SingleAuction from "./components/auction/SingleAuction";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctions",
  bodyClass: "index-page",
  components: { SingleAuction },
  data() {
    return {};
  },
  methods: {
    startsIn(date) {
      return utils.dt_Offset(date);
    }
  },
  computed: {
    myAuctionsFuture() {
      return this.$store.getters["myAuctionsStore/myAuctionsFuture"];
    },
    myAuctionsPast() {
      return this.$store.getters["myAuctionsStore/myAuctionsPast"];
    },
    myAuctionsFutureCount() {
      return this.$store.getters["myAuctionsStore/myAuctionsFutureCount"];
    },
    myAuctionsPastCount() {
      return this.$store.getters["myAuctionsStore/myAuctionsPastCount"];
    }
  }
};
</script>
