<template>
  <mdb-container fluid class="bg-dark flex-1 py-5" data-view>
    <mdb-container class="py-3 py-md-4">
        <mdb-row class="article">
          <single-result v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" class="result-item"/>
         </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import SingleResult from "./components/search/SingleResult";
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
    SingleResult
  },
  name: "home",
  bodyClass: "index-page",
  props: {
    image: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    },
    signup: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
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
       artworkSearchService.newQuery({field: "title", query: "*"});
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
    }
  },
  mounted() {}
};
</script>
<style scoped>
.article {
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: flex-start;
}

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
