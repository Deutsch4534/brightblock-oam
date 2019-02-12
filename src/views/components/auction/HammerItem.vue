<template>
<mdb-card dark>
  <mdb-view hover v-if="inplay">
    <img class="inplay-image img-fluid" width="100%" :src="artwork.image" :alt="artwork.title"></img>
    <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
  </mdb-view>
  <mdb-card-body color="elegant" class="white-text">
    <mdb-card-title>{{artwork.title}}</mdb-card-title>
    <hr class="hr-light"/>
    <div v-if="!loggedIn">
      Log in to bid!
    </div>
    <div v-else>
      <div v-if="inplay">
        <p class="font-small mb-3">Current Bid: {{currentBidder}} {{currencySymbol}} {{currentBid}} {{item.fiatCurrency}}</p>
        <!-- <a class="white-text d-flex justify-content-end"><h5>Read more <mdb-icon icon="angle-double-right" class="pl-1" /></h5></a> -->
        <button
              class="btn btn-primary" :class="bidStatusClass"
              :disabled="paused || item.paused || item.sellingStatus === 'selling'"
              @click.prevent="bid(nextBid)">Bid {{currencySymbol}} {{nextBid}} {{item.fiatCurrency}}</button>
        <button
              v-if="showSetFinalPriceButton"
              class="btn btn-primary"
              v-bind:data-artwork="artwork.id"
              data-toggle="modal"
              data-target="#setFinalBidPriceModal">Sell ({{currentBid}})</button>
        <p v-if="selling && !admin" class="center-block text-center mt-3" v-html="sellingMessage"></p>
        <p v-if="item.sellingStatus === 'selling' && artwork.bcitem">confirming...{{artwork.bcitem.itemIndex}}, {{artwork.bcitem.status}}, {{artwork.bcitem.price}}</p>
        <button class="btn btn-white" v-if="item.sellingStatus === 'selling'" v-on:click="openSetFinalBidPriceDialog">Confirm Price</button>

        <span v-if="admin">
          <button v-if="item.paused" class="btn btn-white" @click.prevent="unpauseBidding">Unpause Bidding</button>
          <button v-else class="btn btn-white" @click.prevent="pauseBidding">Pause Bidding</button>
        </span>
      </div>
    </div>
  </mdb-card-body>
</mdb-card>
</template>

<script>
import peerToPeerService from "@/services/peerToPeerService";
import moneyUtils from "@/services/moneyUtils";
import biddingUtils from "@/services/biddingUtils";
import { mdbCard, mdbView, mdbMask, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "HammerItem",
  components: {
    mdbView,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbMask
  },
  props: {
    auctionId: null,
    admin: false,
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      paused: false
    };
  },
  methods: {
    unpauseBidding() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let message = "Ready to go again now...";
      let messageData = {
        content: message,
        username: myProfile.username,
        auctionId: this.auctionId
      };
      this.$store.commit("myAuctionsStore/messageEvent", messageData);

      let data = {
        username: myProfile.username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      };
      this.$store.commit("myAuctionsStore/unpauseItemEvent", data);
    },
    pauseBidding() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let message = "Pausing the auction, waiting for bidders...";
      let messageData = {
        content: message,
        username: myProfile.username,
        auctionId: this.auctionId
      };
      this.$store.commit("myAuctionsStore/messageEvent", messageData);

      let data = {
        username: myProfile.username,
        auctionId: this.auctionId,
        itemId: this.item.itemId
      };
      this.$store.commit("myAuctionsStore/pauseItemEvent", data);
    },
    bid(amount) {
      let $self = this;
      setTimeout(function() {
        $self.paused = false;
        // $self.$forceUpdate()
      }, 2000);
      this.paused = true;
      let bidSignal = biddingUtils.bidSignal(
        amount,
        this.item.itemId,
        this.auctionId
      );
      if (this.admin) {
        this.$store.commit("myAuctionsStore/sendBidEvent", bidSignal);
      } else {
        peerToPeerService.sendPeerSignal({
          type: "wa-bid-send-adm",
          data: bidSignal
        });
      }
    }
  },
  computed: {
    artwork() {
      if (!this.item.itemId) {
        return {
          title: "no artwork under the hammer right now",
          image: "/images/missing-image.jpg"
        };
      }
      let a = this.$store.getters["artworkSearchStore/getArtwork"](
        this.item.itemId
      );
      if (!a.image) {
        a.image = require("@/assets/img/logo/logo-black-256x256.png");
      }
      return a;
    },
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    },
    bidStatusClass() {
      return biddingUtils.bidStatusClass(this.item);
    },
    showSetFinalPriceButton() {
      return (
        this.admin && this.item.paused && this.item.sellingStatus !== "selling"
      );
    },
    canSell() {
      return true; // this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
    },
    selling() {
      return this.item.sellingStatus === "selling";
    },
    sellingMessage() {
      return biddingUtils.sellingMessage(this.item);
    },
    inplay() {
      return this.item.itemId;
    },
    currencySymbol() {
      return moneyUtils.currencySymbol(this.item.fiatCurrency);
    },
    nextBid() {
      return biddingUtils.nextBid(this.item);
    },
    currentBid() {
      return biddingUtils.currentBid(this.item);
    },
    currentBidder() {
      return biddingUtils.currentBidder(this.item);
    },
    registerForSaleUrl() {
      if (this.item.itemId) {
        let a = this.$store.getters["myArtworksStore/myArtwork"](
          this.item.itemId
        );
        let id = this.artwork.id;
        let amount = a.saleData ? a.saleData.amount : 0;
        let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
        return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      } else {
        return "/";
      }
    }
  }
};
</script>
<style scoped>
.inplay-image  img {
    position: relative;
    display: block;
    width: 100%;
}
</style>
