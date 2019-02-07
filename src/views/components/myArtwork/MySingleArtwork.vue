<template>
<!--<mdb-container>
  <mdb-row class="mb-4">
    <mdb-col lg="5">
      <mdb-view class="rounded z-depth-2 mb-lg-0 mb-4" hover>
        <img class="img-fluid" :src="artwork.image" :alt="artwork.title" />
        <a>
          <mdb-mask overlay="white-slight" waves/>
        </a>
      </mdb-view>
    </mdb-col>
    <mdb-col lg="7">
      <h3 class="font-weight-bold mb-3 p-0">
        <strong>{{artwork.title}}</strong>
      </h3>
      <p>{{artwork.description}}</p>
      <selling-options :artwork="artwork" v-if="!sold"/>
      <p class="artwork-caption" v-if="debugMode && artwork">{{artwork.bcitem}}</p>
      <p>by
        <a>
          <strong>{{artistProfile.name}}</strong>
        </a>, 11/08/2018</p>
        <router-link :to="registerUrl" class="text-white"><mdb-btn color="white" size="md" class="waves-light " v-if="canRegister">Register</mdb-btn></router-link>
        <router-link :to="registerForSaleUrl" class="text-white"><mdb-btn color="white" size="md" class="waves-light " v-if="canSell">Buy</mdb-btn></router-link>
        <router-link :to="registerForAuctionUrl" class="text-white"><mdb-btn color="white" size="md" class="waves-light " v-if="canAuction">Auction</mdb-btn></router-link>
        <a @click="deleteArtwork(artwork.id)" class="text-white"><mdb-btn color="white" size="md" class="waves-light " v-if="debugMode">Delete</mdb-btn></a>
        <router-link :to="editUrl" class="text-white"><mdb-btn color="white" size="md" class="waves-light " v-if="editable">Edit</mdb-btn></router-link>
        <router-link :to="buyNowUrl" class="text-white"><mdb-btn color="white" size="md" class="waves-light ">Open</mdb-btn></router-link>
    </mdb-col>
  </mdb-row>
</mdb-container>-->
  <mdb-card class="bg-transparent mb-5">
    <mdb-card-image :src="artwork.image" :alt="artwork.title"></mdb-card-image>
    <mdb-card-body class="px-0 pb-2 mb-0">
      <mdb-card-title class="subtitle">{{artwork.title}}</mdb-card-title>
      <mdb-card-text>{{artwork.description}}
      <selling-options :artwork="artwork" v-if="!sold"/>
      <p class="artwork-caption" v-if="debugMode && artwork">{{artwork.bcitem}}</p>
        <p>by {{artistProfile.name}}, 11/08/2018</p>
      </mdb-card-text>
    </mdb-card-body>
    <div class="card-buttons d-flex align-items-end justify-content-between flex-wrap">
      <router-link :to="registerUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="canRegister">Register</mdb-btn></router-link>
      <router-link :to="registerForSaleUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="canSell">Buy</mdb-btn></router-link>
      <router-link :to="registerForAuctionUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="canAuction">Auction</mdb-btn></router-link>
      <a @click="deleteArtwork(artwork.id)" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="debugMode">Delete</mdb-btn></a>
      <router-link :to="editUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light" v-if="editable">Edit</mdb-btn></router-link>
      <router-link :to="buyNowUrl" class="inline-block"><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Open</mdb-btn></router-link>
    </div>
  </mdb-card>
</template>

<script>
import SellingOptions from "./SellingOptions";
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleArtwork",
  components: {
    SellingOptions,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn
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
      return this.$store.state.constants.debugMode;
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
    buyNowUrl() {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`;
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
</style>
