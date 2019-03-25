<template>
  <mdb-container fluid class="bg-light flex-1 py-5">
    <mdb-container class="py-3 py-md-4">
      <router-view/>
      <mdb-row>
        <mdb-col col="12">
          <h1 class="h1-responsive mb-5">My Auctions <span>({{myAuctionsFutureCount}})</span></h1>
        </mdb-col>
      </mdb-row>
      <mdb-row v-if="myAuctionsFutureCount > 0">
        <single-auction v-for="(auction, index) of myAuctionsFuture" :key="index" :auction="auction" :atype="'webcast'"/>
      </mdb-row>

      <mdb-row>
        <mdb-col col="12">
          <h1 class="h1-responsive mb-5">Past Auctions</h1>
        </mdb-col>
      </mdb-row>
      <mdb-row v-if="myAuctionsPastCount > 0">
        <single-auction v-for="(auction, index) of myAuctionsPast" :key="index" :auction="auction" :atype="'archive'"/>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import utils from "@/services/utils";
import SingleAuction from "./components/auction/SingleAuction";
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctions",
  bodyClass: "index-page",
  components: { SingleAuction, mdbContainer, mdbRow, mdbCol },
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("myAuctionsStore/fetchMyAuctions");
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
