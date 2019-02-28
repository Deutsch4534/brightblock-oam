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
          <p>{{aboutArtwork.keywords}}</p>
          <mdb-row class="pt-3" v-if="!showInvoiceDetails">
            <mdb-col col="12">
              <p class="h5-responsive serif-italic">{{registerMessageBtc}}</p>
              <buy-artwork-form-btc v-if="isRegisteredBtc && isPriceSetBtc" :purchaseState="purchaseStateBtc" :artwork="artwork" @buy="buyArtwork()"/>
            </mdb-col>
          </mdb-row>
        </mdb-col>
      </mdb-row>
    </mdb-col>
  </mdb-row>
  <invoice-details v-if="showInvoiceDetails" :artwork="artwork" :seller="seller" :buyer="buyer"/>
</mdb-container>
</template>

<script>
import AboutArtwork from "./components/artwork/AboutArtwork";
import InvoiceDetails from "./components/artwork/InvoiceDetails";
import BuyArtworkFormBtc from "./components/artwork/BuyArtworkFormBtc";
import bitcoinService from "@/services/bitcoinService";
import notify from "@/services/notify";
import moneyUtils from "@/services/moneyUtils";
import utils from "@/services/utils";
import { Sticky } from 'mdbvue';
import { mdbIcon, mdbMask, mdbView, mdbJumbotron, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
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
    InvoiceDetails,
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
    mdbJumbotron,
    mdbView
  },
  data() {
    return {
      artwork: {
        image: require("@/assets/img/logo/logo-black-256x256.png"),
        bcitem: {},
        saleData: {},
      },
      message: "",
      owner: null,
      sliderImage: 0,
      showInvoiceDetails: false,
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.owner = this.$route.params.owner;
    // trigger dispatch is not already loaded
    this.$store.getters["userProfilesStore/getProfile"](this.owner);
    this.$store.getters["myAccountStore/getMyProfile"];
    this.$store
      .dispatch("artworkSearchStore/fetchUserArtwork", {username: this.owner, artworkId: this.artworkId})
      .then(artwork => {
        this.artwork = artwork;
        if (artwork) {
          // check for redirect to auctions...
          if (this.artwork.saleData.auctionId) {
            this.$router.push("/online-auction/" + artwork.owner + "/" + artwork.saleData.auctionId);
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
    seller() {
      this.$store.getters["userProfilesStore/getProfile"](this.owner)
    },
    buyer() {
      this.$store.getters["myAccountStore/getMyProfile"]
    },
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("DD/MMM/YYYY");
      }
      return moment(this.artwork.id).format("DD/MMM/YYYY");
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
    purchaseStateBtc() {
      let artwork = this.artwork;
      let username = this.$store.getters["myAccountStore/getMyProfile"].username;
      let ownedBySomeElse = artwork.owner !== username;
      let priceSet = artwork.saleData.amount > 0;
      let forSale = artwork.saleData && artwork.saleData.soid === 1;
      let purchaseState = {
        canBuy: username && forSale && priceSet && ownedBySomeElse
      };
      return purchaseState;
    },
    registerMessageBtc() {
      let artwork = this.artwork;
      let message;
      try {
        let registered = artwork.bitcoinTx;
        let price = artwork.saleData.amount > 0;
        if (!registered) {
          message = "Artwork not registered on blockchain."
        } else {
          if (price) {
            message = "Artwork is registered on blockchain."
          } else {
            message = "Artwork is registered on chain but is not currently for sale."
          }
        }
      } catch (e) {
          message = "Unregistered.";
      }
      return message;
    },
    isRegisteredBtc() {
      return this.artwork.bitcoinTx;
    },
    isPriceSetBtc() {
      let artwork = this.artwork;
      return artwork.saleData.amount > 0;
    },
    artworks() {
      let artwork = this.artwork;
      return this.$store.getters["artworkSearchStore/getArtworksByArtist"](
        artwork.artist
      );
    }
  },
  methods: {
    buyArtwork() {
      this.showInvoiceDetails = !this.showInvoiceDetails;
    },

    scrollToAboutSection() {
      const element = this.$refs.about;
      const top = element.$el.offsetTop;
      window.scrollTo(0, top);
    },

    sliderImageChanged(imageNum) {
      this.sliderImage = imageNum;
    }
  }
};
</script>
<style>
.view img {
  width: 100%;
}
.jumbotron {
  height: 130vh;
}
</style>
