<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <mdb-container class="mt-5">
    <mdb-row>
      <mdb-col col="12" md="7">
        <mdb-view hover>
          <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
      </mdb-col>
      <mdb-col col="12" md="5" class="pl-md-3">
        <h2>{{artwork.title}}</h2>
        <p>by <router-link :to="artistUrl()"><u>{{artist.name}}</u></router-link>, {{created}}</p>
        <p class="mb-1">{{artwork.description}}</p>
        <p><b>{{keywords}}</b></p>
        <buy-artwork-form-btc v-if="isNotBeingBought && showBuyOptions && isRegisteredAndPriceSet" :artwork="artwork" :myProfile="myProfile"/>
        <div v-else>
          <button :disabled="true" class="btn teal darken-1">not for sale</button>
          <router-link to="/gallery">
            <button class="btn teal lighten-1">continue browsing</button>
          </router-link>
        </div>
      </mdb-col>
    </mdb-row>
  </mdb-container>
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
        image: require("@/assets/img/missing/artwork-missing.jpg"),
        saleData: {},
      },
      myProfile: {},
      showBuyOptions: false
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    let $self = this;
    artworkSearchService.newQuery({field: "id", query: this.artworkId}, function(artwork) {
      $self.artwork = artwork;
      if (artwork) {
        $self.showBuyOptions = true;
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
      return {name: ""};
    },
    isNotBeingBought() {
      return this.artwork.status !== this.$store.state.constants.statuses.artwork.PURCHASE_BEGUN;
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
  methods: {
    artistUrl () {
      let artwork = this.artwork;
      return '/artists/' + artwork.artist;
    }
  }
};
</script>
<style>
.view img {
  width: 100%;
}
</style>
