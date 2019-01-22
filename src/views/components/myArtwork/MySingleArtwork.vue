<template>
<div class="md-layout md-gutter">
  <div class="md-layout-item md-size-25 md-xsmall-size-100">
    <img :src="artwork.image" :alt="artwork.title">
  </div>
  <div class="md-layout-item md-size-50 md-xsmall-size-100">
    <h5 class="mt-0 mb-1">{{artwork.title}}</h5>
    <p class="artwork-caption">Artist: {{artistProfile.name}}</p>
    <p class="artwork-caption">{{artwork.description}}</p>
    <p class="artwork-caption" v-if="debugMode">{{artwork.bcitem}}</p>
    <div class="md-layout">
      <div class="md-layout-item md-size-20" v-if="canRegister"><router-link :to="registerUrl">Register</router-link></div>
      <div class="md-layout-item md-size-20" v-if="canSell">    <router-link :to="registerForSaleUrl">Buy</router-link></div>
      <div class="md-layout-item md-size-20" v-if="canAuction">    <router-link :to="registerForAuctionUrl">Auction</router-link></div>
      <div class="md-layout-item md-size-20" v-if="debugMode">  <a @click="deleteArtwork(artwork.id)">Delete</a></div>
      <div class="md-layout-item md-size-20" v-if="editable">   <router-link :to="editUrl" class="artwork-action">Edit</router-link></div>
    </div>
  </div>
  <div class="md-layout-item md-size-25 md-xsmall-size-100">
    <selling-options :artwork="artwork"/>
  </div>
</div>
</template>

<script>
import SellingOptions from "./SellingOptions";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleArtwork",
  components: {
    SellingOptions
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
    return {};
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
      return process.env.VUE_APP_DEBUG_MODE;
    },
    canSell() {
      return this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
    },
    canAuction() {
      let auctions = this.$store.getters["myAuctionsStore/myAuctionsFuture"];
      let cs = this.$store.getters["myArtworksStore/canSell"](this.artwork.id);
      return cs && auctions && auctions.length > 0;
    },
    canRegister() {
      return this.$store.getters["myArtworksStore/canRegister"](
        this.artwork.id
      );
    },
    artistProfile() {
      let profile = this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.artist
      );
      return profile ? profile : {};
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
    },
    registerUrl() {
      return `/my-artwork/register/${this.artwork.id}`;
    },
    registerForSaleUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
      let id = this.artwork.id;
      let amount = a.saleData ? a.saleData.amount : 0;
      let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
      return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
    },
    registerForAuctionUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
      let id = this.artwork.id;
      let r = a.saleData ? a.saleData.reserve : 0;
      let i = a.saleData ? a.saleData.increment : 0;
      let c = a.saleData ? a.saleData.fiatCurrency : "EUR";
      let aid = -1;
      if (a.saleData && a.saleData.auctionId) {
        aid = a.saleData.auctionId;
      }
      return `/my-artwork/register-for-auction/${id}/${aid}/${r}/${i}/${c}`;
    }
  }
};
</script>
<style scoped>
.md-layout-item {
  margin-bottom: 20px;
}
</style>
