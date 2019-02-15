<template>
<div class="container mt-5" v-if="finished">
  <div class="row">
    <div class="col-md-12 ">
    <mdb-media tag="div">
      <img v-if="auction.logo" class="img-fluid d-flex mr-3" style="width: 30%;" :src="auction.logo.dataUrl" alt="auction.logo.name" />
      <mdb-media-body>
        <h5 class="mt-0 mb-2 font-weight-bold">{{auction.title}}</h5>
        <p>{{auction.description}}</p>
        <p class="text-warning">The auction has finished - thanks for your interest.</p>
      </mdb-media-body>
    </mdb-media>
    </div>
  </div>
</div>
<div class="container" v-else-if="artworksSize === 0">
  <div class="row">
    <div class="col-md-12 ">
      <mdb-media tag="div">
        <img v-if="auction.logo" class="img-fluid d-flex mr-3" style="width: 30%;" :src="auction.logo.dataUrl" alt="auction.logo.name" />
        <mdb-media-body>
          <h5 class="mt-0 mb-2 font-weight-bold">{{auction.title}}</h5>
          <p>{{auction.description}}</p>
          <p class="text-warning">The catalogue is being prepared - check back soon.</p>
        </mdb-media-body>
      </mdb-media>
    </div>
  </div>
</div>
<div class="container" v-else>
  <mdb-media tag="div">
    <img v-if="auction.logo" class="img-fluid d-flex mr-3" style="width: 30%;" :src="auction.logo.dataUrl" alt="auction.logo.name" />
    <mdb-media-body>
      <h5 class="mt-0 mb-2 font-weight-bold">{{auction.title}}</h5>
      <p>{{auction.description}}</p>
      <p class="text-warning">The auction has finished - thanks for your interest.</p>
    </mdb-media-body>
  </mdb-media>
  <hr class="my-5">
  <div class="row">
    <div class="col-md-6">
      <hammer-item :item="hammerItem" :auctionId="auctionId"/>
    </div>
    <div class="col-md-6">
      <div class="row" v-if="winning.length > 0">
        <div class="col-md-6">
          <h4>Won items</h4>
          <p v-for="(item, index) of winning" :key="index">
            {{item.itemId}}
          </p>
        </div>
      </div>
      <watchers-stream :auctionId="auctionId"/>
      <video-stream :canPublish="false"/>
      <message-stream :auctionId="auctionId" :admin="false"/>
    </div>
  </div>
  <hr class="my-5">
  <div class="row" v-if="artworksSize > 0">
    <div class="col-md-12 ">
      <h4>Next Items</h4>
      <ul class="list-unstyled">
        <single-auction-item class="auction-item-container" v-for="(item, index) of sellingItems" :key="index" :item="item" :auctionId="auctionId"/>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import SingleAuctionItem from "./components/auction/SingleAuctionItem";
import HammerItem from "./components/auction/HammerItem";
import MessageStream from "./components/rtc/MessageStream";
import VideoStream from "./components/rtc/VideoStream";
import WatchersStream from "./components/rtc/WatchersStream";
import utils from "@/services/utils";
import peerToPeerService from "@/services/peerToPeerService";
import { mdbMedia, mdbMediaBody, mdbMediaImage } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OnlineAuction",
  bodyClass: "index-page",
  components: {
    WatchersStream,
    SingleAuctionItem,
    HammerItem,
    VideoStream,
    MessageStream,
    mdbMedia,
    mdbMediaBody,
    mdbMediaImage
  },
  data() {
    return {
      auctionId: null,
      username: null
    };
  },
  beforeDestroy() {
    peerToPeerService.disconnect();
  },
  mounted() {
    window.addEventListener("beforeunload", this.stopPublishing);
    this.auctionId = Number(this.$route.params.auctionId);
    this.username = this.$route.params.username;
    /**
    let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
      this.auctionId
    );
    let $self = this;
    **/
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      this.startPeerConnection(myProfile.username, this.auctionId);
      /**
      if (!auction) {
        this.$store
          .dispatch("onlineAuctionsStore/fetchUserAuctions", this.auctionId)
          .then(() => {
            auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
              $self.auctionId
            );
            $self.auction = auction;
            this.startPeerConnection(myProfile.username, auction.auctionId);
          });
      } else {
        this.auction = auction;
        this.startPeerConnection(myProfile.username, auction.auctionId);
      }
      **/
    });
  },
  methods: {
    myUsername() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile) {
        return myProfile.username;
      } else {
        return "";
      }
    },
    startPeerConnection(username, auctionId) {
      try {
        peerToPeerService.startSession(username, auctionId);
      } catch (e) {
        console.log(e);
      }
    }
  },
  computed: {
    auction() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (auction) {
        return auction;
      } else {
        return {
          title: "no title"
        };
      }
    },
    administrator() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (auction) {
        return auction.administrator;
      } else {
        return {};
      }
    },
    winning() {
      let winning = this.$store.getters["onlineAuctionsStore/getWinning"]({
        auctionId: this.auctionId,
        username: this.username
      });
      return winning;
    },
    sellingItems() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (auction && auction.items) {
        let following = auction.items.filter(item => !item.inplay);
        return following;
      } else {
        return [];
      }
    },
    hammerItem() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (auction && auction.items) {
        let hammerItems = auction.items.filter(item => item.inplay);
        if (hammerItems && hammerItems.length === 1) {
          return hammerItems[0];
        }
      }
      return {};
    },
    peers() {
      return this.$store.getters["onlineAuctionsStore/getPeers"];
    },
    artworksSize() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      return auction && auction.items ? auction.items.length : 0;
    },
    finished() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      if (!auction || !auction.items) {
        return true;
      }
      let over = true;
      auction.items.forEach(function(item) {
        if (!item.finished) {
          over = false;
        }
      });
      return over;
    },
    countdown() {
      let auction = this.$store.getters["onlineAuctionsStore/onlineAuction"](
        this.auctionId
      );
      let serverTime = this.$store.getters["serverTime"];
      return auction ? utils.dt_Offset(serverTime, auction.startDate) : "?";
    }
  }
};
</script>
