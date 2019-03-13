<template>
<div class="container">
  <div class="row">
    <div class="col-md-12">
      <h1>Auction Management</h1>
    </div>
    <div class="col-md-6">
      <h3>{{auction.title}} <span v-if="auction.items">({{auction.items.length}} items)</span></h3>
      <p>{{auction.description}}</p>
      <p>
        <a v-if="auction.privacy === 'private'" @click.prevent="makePublic()"><mdb-icon icon="lock"/> Hidden</a>
        <a v-else @click.prevent="makePrivate()"><mdb-icon icon="unlock"/> Published.</a>
      </p>
      <p>{{countdown}}</p>
    </div>
    <div class="col-md-6">
      <p>
        <router-link :to="updateUrl"><mdb-btn color="white">Edit</mdb-btn></router-link>
        <router-link :to="onlineAuctionUrl"><mdb-btn color="white">View</mdb-btn></router-link>
        <mdb-btn color="danger" @click.prevent="deleteAuction()">Delete</mdb-btn>
        <!--
        <button v-if="auction.privacy === 'private'" class="btn teal lighten-1" @click.prevent="makePublic()">make public</button>
        <button v-else class="btn teal lighten-1" @click.prevent="makePrivate()">make private</button>
        -->
      </p>
    </div>
  </div>
  <hr class="my-5">
  <div class="row" v-if="hammerItem">
    <div class="col-md-6">
      <hammer-item :item="hammerItem" :admin="true" :auctionId="auctionId"/>
    </div>
    <div class="col-md-6">
      <div class="row" v-if="winning">
        <div class="col-md-6">
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
  <hr class="my-5">
  <div class="row">
    <div class="col-md-12">
      <h4>Items ({{sellingItemsSize}})</h4>
      <ul class="list-unstyled">
        <my-single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="true"/>
      </ul>
    </div>
  </div>
  <hr class="my-5"/>
  <div class="row">
    <div class="col-md-12">
      <h4>Available Items</h4>
      <ul class="list-unstyled mt-5">
        <my-single-auction-item class="auction-item-container" v-for="(item, index) of availableItems" :key="index" :item="item" :auctionId="auctionId" :sellingItem="false"/>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import WatchersStream from "./components/rtc/WatchersStream";
import MessageStream from "./components/rtc/MessageStream";
import VideoStream from "./components/rtc/VideoStream";
import MySingleAuctionItem from "./components/auction/MySingleAuctionItem";
import HammerItem from "./components/auction/HammerItem";

import utils from "@/services/utils";
import notify from "@/services/notify";
import peerToPeerService from "@/services/peerToPeerService";
import eventBus from "@/services/eventBus";
import { mdbBtn, mdbIcon } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionManage",
  bodyClass: "index-page",
  components: {
    mdbBtn,
    mdbIcon,
    WatchersStream,
    HammerItem,
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
      return this.$store.state.constants.debugMode;
    },
    updateUrl() {
      return `/my-auctions/update/${this.auctionId}`;
    },
    hammerItem() {
      let hammerItem;
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
