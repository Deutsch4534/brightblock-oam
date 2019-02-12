<template>
  <mdb-container fluid class="bg-dark flex-1">
    <mdb-container class="py-5">
      <mdb-row>
        <div class="col-12">
          <h1 class="h2-responsive mb-5 text-white">Gallery</h1>
        </div>
      </mdb-row>
        <mdb-row class="gallery-grid" data-masonry='{ "itemSelector": ".gallery-item"}'>
            <gallery-artwork v-for="(artwork, index) in artworks" :key="index" :artwork="artwork" class="gallery-item col-sm-6 col-md-4 col-lg-3"/>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import GalleryArtwork from "./components/gallery/GalleryArtwork";
import artworkSearchService from "../services/artworkSearchService";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbContainer, mdbRow } from 'mdbvue';

export default {
  components: {
    mdbContainer,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    // SingleAuction,
    // LastArtwork,
    GalleryArtwork
  },
  name: "home",
  bodyClass: "index-page",
  props: {
    image: {
      type: String,
      default: require("@/assets/img/city.jpg")
    },
    signup: {
      type: String,
      default: require("@/assets/img/city.jpg")
    }
  },
  data() {
    return {
      firstname: null,
      email: null,
      password: null
    };
  },
   created() {
     // this.$store.dispatch("onlineAuctionsStore/fetchOnlineAuctions").then(() => {
       // loading online auctions
     // });
     if (this.$store.state.constants.featureBitcoin) {
       // this.$store.dispatch("artworkSearchStore/fetchSearchResults", {term: "title", query: "*"});
       artworkSearchService.newQuery("*");
     } else {
       this.$store.dispatch("ethStore/fetchClientState").then(clientState => {
         ethereumService.connectToBlockChain(clientState);
         this.$store.dispatch("ethStore/fetchBlockchainItems").then(blockchainItems => {
           store.dispatch("artworkSearchStore/fetchRegisteredArtworks", blockchainItems);
         });
       });
     }
   },
  methods: {},
  computed: {
    artworks() {
      if (this.$store.state.constants.featureBitcoin) {
        return this.$store.getters["artworkSearchStore/getBitcoinResults"];
      } else {
        return this.$store.getters["artworkSearchStore/homePageArtworks"];
      }
    },
    // auctionsSize() {
    //   return this.$store.getters["onlineAuctionsStore/onlineAuctions"].length;
    // },
    // onlineAuctions() {
    //   return this.$store.getters["onlineAuctionsStore/onlineAuctions"];
    // }
  },
  mounted() {}
};
</script>
<style>
/* .section-download {
  .btn + .btn {
    margin-left: 5px;
  }
} */

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
<style scoped>
.card-body p,
.subtitle {
    color: white!important;
}
</style>
