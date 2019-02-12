<template>
  <mdb-container fluid class="bg-light flex-1 py-5">
    <mdb-container>
      <!--<mdb-card dark>-->
      <mdb-row>
        <mdb-col col="12" lg="10">
          <mdb-row class="py-5">
        <mdb-col col="12" md="6">
          <mdb-view hover>
            <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
            <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
          </mdb-view>
        </mdb-col>
        <mdb-col col="12" md="6" class="pl-md-5">
          <h1 class="h5-responsive">{{artwork.title}}</h1>
          <p class="h5-responsive">by <a><u>{{artist.name}}</u></a>, 19/08/2016</p>
          <p class="mb-0">{{artwork.description}}</p>
          <p>{{aboutArtwork.keywords}}</p>
          <mdb-row class="pt-3">
            <mdb-col col="12">
              <p class="h5-responsive serif-italic">{{registerMessage}}</p>
              <buy-artwork-form v-if="isRegistered && isPriceSet" :purchaseState="purchaseState" :artwork="artwork" @buy="buyArtwork()"/>
            </mdb-col>
          </mdb-row>
        </mdb-col>
      </mdb-row>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import AboutArtwork from "./components/artwork/AboutArtwork";
import BuyArtworkForm from "./components/artwork/BuyArtworkForm";
import ethereumService from "@/services/ethereumService";
import notify from "@/services/notify";
import moneyUtils from "@/services/moneyUtils";
import { Sticky } from 'mdbvue';
import { mdbIcon, mdbMask, mdbView, mdbJumbotron, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbContainer, mdbCol, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Artwork",
  directives: {
    'sticky': Sticky
  },
  bodyClass: "index-page",
  components: {
    BuyArtworkForm,
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
        type: Object,
        image: require("@/assets/img/logo/logo-black-256x256.png"),
        default() {
          return {
            bcitem: {},
          };
        }
      },
      message: "",
      sliderImage: 0
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.owner = this.$route.params.owner;
    this.$store
      .dispatch("artworkSearchStore/fetchUserArtwork", {
        username: this.owner,
        artworkId: this.artworkId
      })
      .then(artwork => {
        this.artwork = artwork;
        if (artwork) {
          let bcdata = artwork.bcitem;
          if (bcdata && bcdata.itemIndex > -1) {
            // check for redirect to auctions...
            if (this.artwork.saleData.auctionId) {
              this.$router.push(
                "/online-auction/" + artwork.owner + "/" + artwork.saleData.auctionId
              );
            }
          }
        }
      });
  },
  computed: {
    artist() {
      let artwork = this.artwork;
      return this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
    },
    headerStyle() {
      return {
        "background-image": `url(${this.artwork.image})`,
      };
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
    purchaseState() {
      let artwork = this.artwork;
      let username = this.$store.getters["myAccountStore/getMyProfile"]
        .username;
      let ownedBySomeElse = artwork.owner !== username;
      let priceSet = artwork.bcitem && artwork.bcitem.price > 0;
      let forSale = artwork.saleData && artwork.saleData.soid === 1;
      let purchaseState = {
        canBuy: username && forSale && priceSet && ownedBySomeElse
      };
      return purchaseState;
    },
    registerMessage() {
      let artwork = this.artwork;
      let message;
      try {
        let registeredE = artwork.bcitem && artwork.bcitem.itemIndex && artwork.bcitem.itemIndex > 0;
        let registeredB = artwork.btcData && artwork.btcData.bitcoinTx;
        let registered = registeredB || registeredE;

        let priceE = artwork.bcitem && artwork.bcitem.price > 0 && artwork.bcitem.price > 0;
        let priceB = artwork.btcData && artwork.saleData.amount > 0;
        let price = priceB || priceE;
        if (!registered) {
          message = "Artwork not registered on blockchain."
        } else {
          if (price) {
            message = "Artwork not registered on blockchain."
          } else {
            message =" Artwork is registered on chain but is not currently for sale."
          }
        }
      } catch (e) {
          message = "Unregistered.";
      }
      return message;
    },
    isRegistered() {
      let artwork = this.artwork;
      try {
        let registeredE = artwork.bcitem && artwork.bcitem.itemIndex && artwork.bcitem.itemIndex > 0;
        let registeredB = artwork.btcData && artwork.btcData.bitcoinTx;
        let registered = registeredB || registeredE;
      } catch (e) {
        return false;
      }
    },
    isPriceSet() {
      let artwork = this.artwork;
      try {
        return artwork.bcitem && artwork.bcitem.price > 0 && artwork.bcitem.price > 0;
      } catch (e) {
        return false;
      }
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
      let artwork = this.artwork;
      // let seller = artwork.owner
      let seller = artwork.bcitem.blockstackId;
      let buyer = this.$store.getters["myAccountStore/getMyProfile"].username;
      if (!buyer || !seller || buyer === seller) {
        return;
      }

      if (artwork.title !== artwork.bcitem.title) {
        return;
      }

      let purchaseData = {
        itemIndex: artwork.bcitem.itemIndex,
        price: artwork.bcitem.price,
        buyer: buyer
      };

      let $self = this;
      ethereumService.purchase(
        purchaseData,
        function() {
          notify.info({
            title: "Purchase Artwork.",
            text: "Artwork purchase order sent to blockchain."
          });
          artwork.owner = buyer;
          artwork.bcitem.blockstackId = buyer;
          artwork.saleData = moneyUtils.buildInitialSaleData();
          $self.$store
            .dispatch("myArtworksStore/transferArtwork", artwork)
            .then(artwork => {
              notify.info({
                title: "Purchase Artwork.",
                text: "Artwork info has been moved to your user storage."
              });
              $self.$store
                .dispatch("ethStore/fetchBlockchainItem", {
                  timestamp: artwork.timestamp
                })
                .then(blockchainItem => {
                  if (blockchainItem) {
                    notify.info({
                      title: "Purchase Artwork.",
                      text: "Congratulations - artwork purchase complete."
                    });
                  }
                });
            });
        },
        function(error) {
          notify.error({
            title: "Purchase Artwork.",
            text: "Error purchasing item. <br>" + error.message
          });
        }
      );
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
