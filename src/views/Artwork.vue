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
        </mdb-col>
        <shopping-owner-view v-if="ready && iamowner" :artwork="artwork"/>
        <shopping-buyer-view v-else-if="ready && iambuyer && purchaseBegun" :artwork="artwork"/>
        <invoice-details v-else-if="showInvoiceDetails" :invoiceClaim="invoiceClaim"/>
        <buy-artwork-form-btc v-if="isRegisteredBtc && isPriceSetBtc && !purchaseBegun && !iamowner" :purchaseState="purchaseStateBtc" :artwork="artwork" @buy="buyArtwork()"/>
      </mdb-row>
    </mdb-col>
  </mdb-row>
</mdb-container>
</template>

<script>
import ShoppingOwnerView from "./components/invoice/ShoppingOwnerView";
import ShoppingBuyerView from "./components/invoice/ShoppingBuyerView";
import AboutArtwork from "./components/artwork/AboutArtwork";
import InvoiceDetails from "./components/invoice/InvoiceDetails";
import BuyArtworkFormBtc from "./components/artwork/BuyArtworkFormBtc";
import bitcoinService from "@/services/bitcoinService";
import artworkSearchService from "@/services/artworkSearchService";
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
    ShoppingOwnerView,
    ShoppingBuyerView,
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
      ready: false,
      invoiceClaim: {},
      message: "",
      owner: null,
      sliderImage: 0,
      showInvoiceDetails: false,
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.$store.getters["myAccountStore/getMyProfile"];
    let $self = this;
    artworkSearchService.newQuery({field: "id", query: this.artworkId}, function(artwork) {
      $self.artwork = artwork;
      if (artwork) {
        $self.ready = true;
        $self.owner = artwork.owner;
        $self.$store.getters["userProfilesStore/getProfile"]($self.owner);
        if (artwork.buyer) $self.$store.getters["userProfilesStore/getProfile"](artwork.buyer);
        $self.$store.dispatch("invoiceStore/fetchInvoice", $self.artworkId).then(invoiceClaim => {
          if (invoiceClaim) {
            $self.invoiceClaim = invoiceClaim;
          } else {
            $self.$store.dispatch("invoiceStore/prepareNewInvoice", artwork).then((invoice) => {
              $self.invoiceClaim = invoice;
            });
          }
        })
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
    buyerShippingAddress() {
      let artwork = this.artwork;
      let buyer = this.$store.getters["userProfilesStore/getShippingAddress"](artwork.buyer, artwork.owner);
      return buyer;
    },
    iamowner() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return profile.username === this.artwork.owner;
    },
    iambuyer() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return profile.username === this.artwork.buyer;
    },
    purchaseBegun() {
      return this.artwork.status === this.$store.state.constants.statuses.artwork.PURCHASE_BEGUN;
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
