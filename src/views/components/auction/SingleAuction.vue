<template>
<div class="col-md-4 col-sm-6 col-xs-12 mb-3">
  <mdb-card>
    <mdb-card-image :src="logo" alt="Auction Logo"></mdb-card-image>
    <mdb-card-body>
      <mdb-card-title>{{auction.title}}</mdb-card-title>
      <mdb-card-text>{{auction.description}}</mdb-card-text>
      <mdb-card-text>{{countdown}}</mdb-card-text>
      <router-link v-if="canJoin" :to="onlineAuctionUrl"><mdb-btn color="white">Join</mdb-btn></router-link>
      <router-link v-if="isAdministrator" :to="manageUrl"><mdb-btn color="white">Manage</mdb-btn></router-link>
    </mdb-card-body>
  </mdb-card>
</div>
</template>

<script>
import utils from "@/services/utils";
import moment from "moment";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';

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
