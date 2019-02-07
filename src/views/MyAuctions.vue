<template>
  <mdb-container fluid class="bg-light flex-1">
    <mdb-container class="py-5">
      <router-view/>
      
      <mdb-row v-if="myAuctionsFutureCount > 0">
        <div class="col-md-12">
          <h1 class="h2-responsive mb-5">My Auctions <span>({{myAuctionsFutureCount}})</span></h1>
        </div>
        <single-auction v-for="(auction, index) of myAuctionsFuture" :key="index" :auction="auction" :atype="'webcast'"/>
      </mdb-row>

      <mdb-row v-if="myAuctionsPastCount > 0">
        <div class="col-md-12">
          <h2 class="h2-responsive mb-5">Archives</h2>
        </div>
        <single-auction v-for="(auction, index) of myAuctionsPast" :key="index" :auction="auction" :atype="'archive'"/>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import utils from "@/services/utils";
import SingleAuction from "./components/auction/SingleAuction";
import { mdbContainer, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctions",
  bodyClass: "index-page",
  components: { SingleAuction, mdbContainer, mdbRow },
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
