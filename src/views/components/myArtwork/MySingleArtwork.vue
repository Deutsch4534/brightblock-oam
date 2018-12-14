<template>
<div class="md-layout-item md-size-20 md-xsmall-size-100">
  <sell-via-registering :showRegisterModal="showRegisterModal" :artwork="artwork"/>
  <sell-via-buy-now :showBuyNowModal="showBuyNowModal" :artwork="artwork"/>
  <sell-via-auction :showAuctionModal="showAuctionModal" :artwork="artwork"/>

  <img :src="artwork.image" :alt="artwork.title" class="mr-3 img-fluid" style="max-width: 250px;">
  <div class="media-body row">
    <div class="col-sm-7">
      <h5 class="mt-0 mb-1">{{artwork.title}}</h5>
      <p class="artwork-caption">Artist: {{artistProfile.name}}</p>
      <p class="artwork-caption">{{artwork.description}}</p>

      <a class="artwork-action" v-if="canRegister" v-on:click="showRegisterModal = !showRegisterModal">Register {{status}}</a>
      <a class="artwork-action" v-if="canSell" @click="showBuyNowModal = !showBuyNowModal">Buy</a>
      <a class="artwork-action" v-if="canSell" @click="showAuctionModal = !showAuctionModal">Bid</a>
      <router-link :to="editUrl" class="artwork-action" v-if="editable">Edit</router-link>
      <a class="artwork-action" @click="deleteArtwork(artwork.id)" v-if="debugMode">Delete</a>
    </div>
    <selling-options :artwork="artwork"/>
  </div>
</div>
</template>

<script>
import SellingOptions from "./SellingOptions";
import SellViaRegistering from "./SellViaRegistering";
import SellViaAuction from "./SellViaAuction";
import SellViaBuyNow from "./SellViaBuyNow";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleArtwork",
  components: {
    SellingOptions,
    SellViaRegistering,
    SellViaBuyNow,
    SellViaAuction
  },
  props: {
    sold: true,
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      showRegisterModal: false,
      showBuyNowModal: false,
      showAuctionModal: false
    };
  },
  mounted() {},
  methods: {
    deleteArtwork(id) {
      this.$store.dispatch("myArtworksStore/deleteMyArtwork", id);
    }
  },
  computed: {
    editable() {
      return this.$store.getters["myArtworksStore/editable"](this.artwork.id);
    },
    debugMode() {
      return this.$store.getters["isDebugMode"];
    },
    canRegister() {
      return !this.sold;
    },
    canSell() {
      let bcitem = this.artwork.bcitem;
      return bcitem && bcitem.itemIndex > -1 && !this.sold;
    },
    sellingBuyNow() {
      return this.artwork.saleData.soid === 1;
    },
    status() {
      return this.$store.getters["myArtworksStore/bcstatus"](this.artwork.id);
    },
    artistProfile() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.artist
      );
    },
    ownerProfile() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.owner
      );
    },
    artworkWidth() {
      return `col-sm-${this.width}`;
    },
    editUrl() {
      return `/my-artwork/update/${this.artwork.id}`;
    }
  }
};
</script>
