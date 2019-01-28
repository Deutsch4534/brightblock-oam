<template>
<mdb-jumbotron class="mb-0 text-center hoverable p-4">
  <mdb-row>
    <mdb-col md="4" offsetMd="1" class="m-3">
      <mdb-view :src="artwork.image" :alt="artwork.title">
        <a><mdb-mask waves overlay="white-slight"/></a>
      </mdb-view>
    </mdb-col>
    <mdb-col md="7" class="text-md-left ml-3 mt-3">
      <a href="#!" class="green-text">
        <h6 class="h6 pb-1"><mdb-icon icon="desktop" class="pr-1"/> Purchase</h6>
      </a>
      <h4 class="h4 mb-4">{{artwork.title}}</h4>
      <p class="font-weight-normal">{{artwork.description}}</p>
      <p class="font-weight-normal">by <a><strong>{{artist.name}}</strong></a>, 19/08/2016</p>
      <p class="keywords">Keywords ︱ {{aboutArtwork.keywords}}</p>
      <mdb-btn tag="a" gradient="purple" rounded class="mb-4">Button</mdb-btn>
      <buy-artwork-form v-sticky="{ zIndex: 12, stickyTop: 50 }" :purchaseState="purchaseState" :artwork="artwork" @buy="buyArtwork()"/>
    </mdb-col>
  </mdb-row>
</mdb-jumbotron>

<mdb-jumbotron class="mb-0 text-center">
  <mdb-card-title class="pb-2 h4"><strong>{{artwork.title}}</strong></mdb-card-title>
  <mdb-view class="rounded-top" :src="artwork.image" :alt="artwork.title">
    <a><mdb-mask waves overlay="white-slight"/></a>
  </mdb-view>
  <mdb-card-body class="text-center">
    <h3 class="card-title h3 my-4"><strong></strong></h3>
    <p class="card-text py-2">{{artwork.description}}</p>
    <p>
      By: {{artist.name}}<br />
    </p>
    <p class="keywords">Keywords ︱ {{aboutArtwork.keywords}}</p>
    <mdb-btn tag="a" gradient="purple" rounded class="mb-4">Button</mdb-btn>
    <buy-artwork-form v-sticky="{ zIndex: 12, stickyTop: 50 }" :purchaseState="purchaseState" :artwork="artwork" @buy="buyArtwork()"/>
  </mdb-card-body>
</mdb-jumbotron>
</template>

<script>
import AboutArtwork from "./components/artwork/AboutArtwork";
import BuyArtworkForm from "./components/artwork/BuyArtworkForm";
import ethereumService from "@/services/ethereumService";
import notify from "@/services/notify";
import moneyUtils from "@/services/moneyUtils";
import { Sticky } from 'mdbvue';
import { mdbMask, mdbView, mdbJumbotron, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbContainer, mdbRow } from 'mdbvue';

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
