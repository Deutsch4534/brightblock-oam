<template>
  <mdb-col sm="6" md="4" lg="3" class="mb-3 d-flex">
    <mdb-card class="bg-transparent mb-5 w-100">
      <mdb-card-image :src="logo" alt="Auction Logo" class="img-square"></mdb-card-image>
      <mdb-card-body class="px-0 pb-2 mb-0">
        <mdb-card-title class="subtitle">{{auction.title}} Title</mdb-card-title>
        <mdb-card-text>{{auction.description}} description</mdb-card-text>
        <!--<mdb-card-text class="text-dark">{{countdown}}</mdb-card-text>-->
      </mdb-card-body>
      <div class="card-buttons d-flex align-items-end justify-content-between flex-wrap">
        <router-link v-if="canJoin" :to="onlineAuctionUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0">Register</mdb-btn></router-link>
        <router-link v-if="isAdministrator" :to="manageUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0">Manage</mdb-btn></router-link>
      </div>
    </mdb-card>
  </mdb-col>
</template>

<script>
import utils from "@/services/utils";
import moment from "moment";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn, mdbCol } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleAuction",
  components: {
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbCol,
  },
  props: {
    auction: {
      type: Object,
      default() {
        return {};
      }
    },
    atype: null,
    bgImage: require("@/assets/img/missing/auction4.jpg"),
    future: false
  },
  methods: {
    convertDate(date) {
      return moment(date).format();
    }
  },
  computed: {
    onlineAuctionUrl() {
      return `/online-auction/${this.auction.administrator}/${
        this.auction.auctionId
      }`;
    },
    logo() {
      if (this.auction.logo) {
        return this.auction.logo.dataUrl;
      }
      return require('@/assets/img/missing/auction4.jpg');
    },
    manageUrl() {
      return `/my-auctions/manage/${this.auction.auctionId}`;
    },
    canJoin() {
      return this.atype !== "archive";
    },
    isAdministrator() {
      let userProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return this.auction.administrator === userProfile.username;
    },
    countdown() {
      let serverTime = this.$store.getters["serverTime"];
      return utils.dt_Offset(serverTime, this.auction.startDate);
    }
  }
};
</script>
<style scoped>
  .subtitle,
  .card-body p {
    color: #000!important;
  }
</style>
