<template>
<div class="md-layout md-gutter">
  <div class="md-layout-item md-size-100">
    <h4>{{artwork.title}}</h4>
    <p>Current Bid: {{currentBidder}} {{currencySymbol}} {{currentBid}} {{item.fiatCurrency}}</p>
    <img :src="artwork.image" :alt="artwork.title"/>
  </div>
  <div class="md-layout-item md-size-100"  v-if="inplay">
    <md-button
          class="md-primary" :class="bidStatusClass"
          :disabled="paused || item.paused || item.sellingStatus === 'selling'"
          @click.prevent="bid(nextBid)">Bid {{currencySymbol}} {{nextBid}} {{item.fiatCurrency}}</md-button>
    <md-button
          v-if="showSetFinalPriceButton"
          class="md-primary"
          v-bind:data-artwork="artwork.id"
          data-toggle="modal"
          data-target="#setFinalBidPriceModal">Sell ({{currentBid}})</md-button>
    <p v-if="selling && !admin" class="center-block text-center mt-3" v-html="sellingMessage"></p>
    <p v-if="item.sellingStatus === 'selling' && artwork.bcitem">confirming...{{artwork.bcitem.itemIndex}}, {{artwork.bcitem.status}}, {{artwork.bcitem.price}}</p>
    <md-button class="md-primary" v-if="item.sellingStatus === 'selling'" v-on:click="openSetFinalBidPriceDialog">Confirm Price</md-button>

    <span v-if="admin">
      <md-button v-if="item.paused" class="md-primary" @click.prevent="pauseBidding">Unpause Bidding</md-button>
      <md-button v-else class="md-primary" @click.prevent="pauseBidding">Pause Bidding</md-button>
    </span>
  </div>
</div>
</template>

<script>
import peerToPeerService from "@/services/peerToPeerService";
import moneyUtils from "@/services/moneyUtils";
import biddingUtils from "@/services/biddingUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "HammerItem",
  components: {},
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
    pauseBidding() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      let message = "Pausing the auction to wait for bidders to catch up...";
      if (this.item.paused) {
        message = "Ready to go again now...";
      }
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
      return this.$store.getters["artworkSearchStore/getArtwork"](
        this.item.itemId
      );
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
