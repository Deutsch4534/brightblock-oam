<template>
<div class="container">
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <h1>{{auction.title}} <span v-if="auction.items">({{auction.items.length}} items)</span></h1>
    </div>
    <div class="md-layout-item md-size-50">
      <p>{{auction.description}}</p>
      <p>{{countdown}}</p>
    </div>
    <div class="md-layout-item md-size-50">
      <p>
        <router-link :to="updateUrl"><md-button class="md-primary">edit</md-button></router-link>
        <router-link :to="onlineAuctionUrl"><md-button class="md-primary">view</md-button></router-link>
        <md-button class="md-primary" @click.prevent="deleteAuction()">delete</md-button>
        <md-button v-if="auction.privacy === 'private'" class="md-primary" @click.prevent="makePublic()">make public</md-button>
        <md-button v-else class="md-primary" @click.prevent="makePrivate()">make private</md-button>
      </p>
    </div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-50">
      <hammer-item :item="hammerItem" :admin="true" :auctionId="auctionId"/>
    </div>
    <div class="md-layout-item md-size-50">
      <div class="md-layout" v-if="winning">
        <div class="md-layout-item md-size-50">
          <h4>Won items</h4>
          <p v-for="(item, index) of winning" :key="index">
            {{item.itemId}}
          </p>
        </div>
      </div>
      <watchers-stream :auctionId="auctionId"/>
      <video-stream :canPublish="true"/>
      <message-stream :auctionId="auctionId" :admin="true"/>
    </div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <h4>Selling Items ({{sellingItemsSize}})</h4>
      <my-single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="true"/>
    </div>
    <div class="md-layout-item md-size-100">
      <h4>Available Items</h4>
      <my-single-auction-item class="auction-item-container" v-for="(item, index) of availableItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="false"/>
    </div>
  </div>
</div>
</template>

<script>
import WatchersStream from "./components/rtc/WatchersStream";
import MessageStream from "./components/rtc/MessageStream";
import VideoStream from "./components/rtc/VideoStream";
import MySingleAuction from "./components/auction/MySingleAuction";
import MySingleAuctionItem from "./components/auction/MySingleAuctionItem";
import HammerItem from "./components/auction/HammerItem";

import utils from "@/services/utils";
import notify from "@/services/notify";
import peerToPeerService from "@/services/peerToPeerService";
import eventBus from "@/services/eventBus";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionManage",
  bodyClass: "index-page",
  components: {
    WatchersStream,
    HammerItem,
    MySingleAuction,
    MySingleAuctionItem,
    VideoStream,
    MessageStream
  },
  data() {
    return {
      auctionId: null
    };
  },
  beforeDestroy() {
    peerToPeerService.disconnect();
    eventBus.$off("signal-in-message");
  },
  created() {
    this.auctionId = Number(this.$route.params.auctionId);
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      this.$store
        .dispatch("myAuctionsStore/fetchMyAuction", this.auctionId)
        .then(auction => {
          // this.auction = auction
          try {
            this.$store.commit("onlineAuctionsStore/onlineAuction", auction);
            peerToPeerService.startSession(myProfile.username, this.auctionId);
          } catch (e) {
            console.log(e);
          }
        });
    });
  },
  methods: {
    startsIn(date) {
      return utils.dt_Offset(date);
    },
    deleteAuction() {
      this.$store.dispatch("myAuctionsStore/deleteMyAuction", this.auctionId);
      this.$router.push("/my-artworks");
    },
    makePublic() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.auctionId
      );
      auction.privacy = "public";
      this.$store.dispatch("myAuctionsStore/makePublic", auction);
      notify.info({
        title: "Manage Auction",
        text:
          auction.title +
          " is now public and can be found by others via search results."
      });
    },
    makePrivate() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.auctionId
      );
      auction.privacy = "private";
      this.$store.dispatch("myAuctionsStore/makePrivate", auction);
      notify.info({
        title: "Manage Auction",
        text:
          auction.title + " is now private and can not be found by other users."
      });
    }
  },
  computed: {
    sellingItemsSize() {
      let sellingItems = this.$store.getters["myArtworksStore/auctioning"](
        this.auctionId
      );
      return sellingItems.length;
    },
    winning() {
      let winning = this.$store.getters["onlineAuctionsStore/getWinning"]({
        auctionId: this.auctionId,
        username: this.username
      });
      return winning;
    },
    countdown() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      let serverTime = this.$store.getters["serverTime"];
      return auction ? utils.dt_Offset(serverTime, auction.startDate) : "?";
    },
    auction() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.auctionId
      );
      if (!auction || !auction.auctionId) {
        auction = {
          items: []
        };
      }
      return auction;
    },
    debugMode() {
      return process.env.VUE_APP_DEBUG_MODE;
    },
    updateUrl() {
      return `/my-auctions/update/${this.auctionId}`;
    },
    hammerItem() {
      let hammerItem = {};
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.auctionId
      );
      if (auction && auction.items) {
        let hammerItems = auction.items.filter(item => item.inplay);
        if (hammerItems && hammerItems.length === 1) {
          hammerItem = hammerItems[0];
        }
      }
      return hammerItem;
    },
    availableItems() {
      let available = this.$store.getters["myArtworksStore/available"](
        this.auctionId
      );
      if (available && available.length > 0) {
        let items = [];
        for (let key in available) {
          items.push({
            itemId: available[key].id
          });
        }
        return items;
      } else {
        return [];
      }
    },
    sellingItems() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.auctionId
      );
      if (auction && auction.items) {
        let following = auction.items.filter(item => !item.inplay);
        return following;
      } else {
        return [];
      }
    },
    onlineAuctionUrl() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.auctionId
      );
      if (auction) {
        return `/online-auction/${auction.administrator}/${this.auctionId}`;
      } else {
        return "/";
      }
    }
  }
};
</script>
