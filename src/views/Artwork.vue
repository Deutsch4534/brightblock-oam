<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <mdb-row>
    <mdb-col col="12" lg="10">
      <mdb-row class="py-5">
        <mdb-col col="12" md="4">
          <mdb-view hover>
            <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
            <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
          </mdb-view>
        </mdb-col>
        <mdb-col col="12" md="8" class="pl-md-5">
          <h1 class="h5-responsive"><mdb-icon title="Digital work" far icon="dot-circle" v-if="artwork.itemType === 'digiart'"/> {{artwork.title}}</h1>
          <p class="h5-responsive">by <a><u>{{artist.name}}</u></a>, {{created}}</p>
          <p class="mb-1">{{artwork.description}}</p>
          <p>{{keywords}}</p>
          <buy-artwork-form-btc v-if="isRegisteredAndPriceSet" :artwork="artwork"/>
          <div v-else>
            <mdb-btn rounded color="white" :disabled="true" size="md" class="mr-1 ml-0 waves-light">not for sale</mdb-btn>
            <router-link to="/gallery">
              <mdb-btn rounded color="white" size="md" class="mr-1 ml-0 waves-light">continue browsing</mdb-btn>
            </router-link>
          </div>
        </mdb-col>
      </mdb-row>
    </mdb-col>
  </mdb-row>
</mdb-container>
</template>

<script>
import AboutArtwork from "./components/artwork/AboutArtwork";
import OrderDetails from "./components/orders/OrderDetails";
import BuyArtworkFormBtc from "./components/artwork/BuyArtworkFormBtc";
import bitcoinService from "@/services/bitcoinService";
import artworkSearchService from "@/services/artworkSearchService";
import notify from "@/services/notify";
import moneyUtils from "@/services/moneyUtils";
import utils from "@/services/utils";
import { Sticky } from 'mdbvue';
import { mdbIcon, mdbMask, mdbView, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbContainer, mdbCol, mdbRow } from 'mdbvue';
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Artwork",
  directives: {
    'sticky': Sticky
  },
  bodyClass: "index-page",
  components: {
    OrderDetails,
    BuyArtworkFormBtc,
    AboutArtwork,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon,
    mdbMask,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbView
  },
  data() {
    return {
      artwork: {
        image: require("@/assets/img/logo/logo-black-256x256.png"),
        saleData: {},
      },
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.$store.getters["myAccountStore/getMyProfile"];
    let $self = this;
    artworkSearchService.newQuery({field: "id", query: this.artworkId}, function(artwork) {
      $self.artwork = artwork;
      if (artwork) {
        // check for redirect to auctions...
        if ($self.artwork.saleData.auctionId) {
          $self.$router.push("/online-auction/" + artwork.owner + "/" + artwork.saleData.auctionId);
        }
      }
    });
  },
  computed: {
    artist() {
      let artwork = this.artwork;
      if (artwork.artist) {
        return this.$store.getters["userProfilesStore/getProfile"](artwork.artist);
      }
      return {name: "loading.."};
    },
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("DD/MMM/YYYY");
      }
      return moment(this.artwork.id).format("DD/MMM/YYYY");
    },
    keywords() {
      if (this.artwork.keywords) {
        let keys = this.artwork.keywords.split(",");
        return keys.join(" ");
      }
      return "";
    },
    aboutArtwork() {
      let artwork = this.artwork;
      let artist = this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
      let owner = this.$store.getters["userProfilesStore/getProfile"](
        artwork.owner
      );
      return {
        artist: artist,
        owner: owner,
        title: artwork.title,
        keywords: artwork.keywords,
        year: artwork.year,
        image: artwork.image
      };
    },
    isRegisteredAndPriceSet() {
      return this.artwork.bitcoinTx && this.artwork.saleData.amount > 0;
    },
    artworks() {
      let artwork = this.artwork;
      return this.$store.getters["artworkSearchStore/getArtworksByArtist"](
        artwork.artist
      );
    }
  },
  methods: {}
};
</script>
<style>
.view img {
  width: 100%;
}
</style>
