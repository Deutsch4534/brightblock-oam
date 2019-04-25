<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <mdb-container class="bg-white mt-5 p-3" v-if="loading">
    <div>Loading artwork - please wait...</div>
  </mdb-container>
  <mdb-container class="" v-else>
    <mdb-row class="mdb-lightbox py-5 ">
      <mdb-col col="12" md="7" @click.native="show(0)">
        <mdb-view hover>
          <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
      </mdb-col>
      <mdb-col col="11" md="5" class="pl-md-3">
        <div class="row pl-md-3">
          <mdb-col md="11">
            <h2>{{artwork.title}}</h2>
          </mdb-col>
          <mdb-col md="1">
            <be-social :myPageUrl="myPageUrl" :artist="artist.name"/>
          </mdb-col>
          <mdb-col col="12">
            <p><router-link :to="artistUrl()"><u>{{artist.name}}</u></router-link></p>
            <p class="mb-1">
              {{artwork.dimensions}}
              <br/>
              <description-overflow :text="artwork.description"/>
            </p>
            <p>
              <buy-artwork-form-btc v-if="isNotBeingBought && showBuyOptions && isRegisteredAndPriceSet" :artwork="artwork" :myProfile="myProfile"/>
              <div v-if="!isNotBeingBought || !isRegisteredAndPriceSet">
                <button :disabled="true" class="btn teal darken-1">not for sale</button>
                <router-link to="/gallery">
                  <button class="btn teal lighten-1">continue browsing</button>
                </router-link>
              </div>
            </p>
          </mdb-col>
        </div>
      </mdb-col>
    </mdb-row>
  </mdb-container>
  <mdb-lightbox
  :visible="visible"
  :imgs="images"
  :index="index"
  @hide="handleHide"></mdb-lightbox>
</mdb-container>
</template>

<script>
import AboutArtwork from "./components/artwork/AboutArtwork";
import BuyArtworkFormBtc from "./components/artwork/BuyArtworkFormBtc";
import bitcoinService from "@/services/bitcoinService";
import artworkSearchService from "@/services/artworkSearchService";
import notify from "@/services/notify";
import moneyUtils from "@/services/moneyUtils";
import utils from "@/services/utils";
import { Sticky } from 'mdbvue';
import { mdbIcon, mdbMask, mdbView, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import { mdbLightbox, mdbContainer, mdbCol, mdbRow } from 'mdbvue';
import moment from "moment";
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";
import BeSocial from "@/views/components/utils/BeSocial";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Artwork",
  directives: {
    'sticky': Sticky
  },
  bodyClass: "index-page",
  components: {
    DescriptionOverflow,BeSocial,
    BuyArtworkFormBtc,
    AboutArtwork,
    mdbLightbox,
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
      showBuyOptions: false,
      visible: false,
      index: 0,
      loading: true
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    let $self = this;
    artworkSearchService.newQuery({field: "id", query: this.artworkId}, function(artwork) {
      $self.artwork = artwork;
      if (artwork) {
        document.title = "Artwork at Radicle: " + artwork.title;
        $self.showBuyOptions = true;
        $self.loading = false;
        // check for redirect to auctions...
        if ($self.artwork.saleData.salePlace !== "marketplace" && $self.artwork.saleData.auctionId && $self.artwork.saleData.auctionId > -1) {
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
    images() {
      let images = [];
      images.push(this.artwork.image);
      return images;
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
    myPageUrl() {
      let pathname = encodeURI("https://radicle.art" + location.pathname);
      return pathname;
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
    },
    show(index) {
      this.index = index;
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    }
  }
};
</script>
<style>
.view img {
  width: 100%;
}
</style>
