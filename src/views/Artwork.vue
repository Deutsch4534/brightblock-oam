<template>
<div class="container">
<mdb-card dark>
  <mdb-view hover>
    <img class="inplay-image img-fluid" width="100%" :src="artwork.image" :alt="artwork.title">
    <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
  </mdb-view>
  <mdb-card-body color="elegant" class="white-text">
    <mdb-card-title>{{artwork.title}}</mdb-card-title>
    <hr class="hr-light"/>
    <p class="font-weight-normal">{{artwork.description}}</p>
    <p class="font-weight-normal">by <a><strong>{{artist.name}}</strong></a>, 19/08/2016</p>
    <p class="keywords">Keywords ︱ {{aboutArtwork.keywords}}</p>

    <buy-artwork-form v-if="isRegistered && isPriceSet" :purchaseState="purchaseState" :artwork="artwork" @buy="buyArtwork()"/>
    <p v-else-if="!isRegistered">Artwork not registered on blockchain.</p>
    <p v-else-if="!isPriceSet">Artwork is registered on chain but is not currently for sale.</p>
  </mdb-card-body>
  </mdb-card>
</div>
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
    isRegistered() {
      let artwork = this.artwork;
      try {
        return artwork.bcitem && artwork.bcitem.itemIndex && artwork.bcitem.itemIndex > 0;
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
