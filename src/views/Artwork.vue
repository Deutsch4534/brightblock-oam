<template>
<div class="container">
  <h1>{{artist.name}}, {{artwork.title}}</h1>
  <p class="mb-0">
    1/1 Edition, {{artwork.description}}<br/>
  </p>
  <p>
    Artist: {{artwork.artist}}<br />
    Owner: {{artwork.owner}}
  </p>
  <p class="keywords">Keywords ︱ {{aboutArtwork.keywords}}</p>
  <div id="images">
    <img :src="artwork.image" :alt="artwork.title" class="img-responsive">
  </div>
  <buy-artwork-form :purchaseState="purchaseState" :artwork="artwork" @buy="buyArtwork()"/>
</div>
</template>

<script>
import AboutArtwork from "./components/artwork/AboutArtwork";
import BuyArtworkForm from "./components/artwork/BuyArtworkForm";
import ethereumService from "@/services/ethereumService";
import notify from "@/services/notify";
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Artwork",
  bodyClass: "index-page",
  components: {
    BuyArtworkForm,
    AboutArtwork
  },
  data() {
    return {
      artwork: {
        type: Object,
        default() {
          return {
            bcitem: {}
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
        if (
          this.artwork &&
          this.artwork.bcitem &&
          this.artwork.bcitem.itemIndex > -1
        ) {
          // check for redirect to auctions...
          if (this.artwork.saleData.auctionId) {
            this.$router.push(
              "/online-auction/" +
                this.artwork.owner +
                "/" +
                this.artwork.saleData.auctionId
            );
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
