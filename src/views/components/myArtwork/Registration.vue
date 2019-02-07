<template>
<mdb-container>
  <mdb-row>
    <mdb-col sm="10" class="mx-auto">
    <h1>Artwork Registration</h1>
    <hr/>
    </mdb-col>
    <mdb-col sm="10" class="mx-auto">
      <mdb-card>
        <mdb-view hover>
          <img class="img-fluid" width="100%" :src="artwork.image" :alt="artwork.title"></img>
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
        <mdb-card-body>
          <mdb-card-title>{{artwork.title}}</mdb-card-title>
          <mdb-card-title class="text-right"><small>{{myArtist.name}}</small></mdb-card-title>
          <mdb-card-text>Registering the artwork on the blockchain creates a Certificate of Authenticity (COA) that helps show the provenance of the
          artwork and makes possible our unique ability to pay residuals to artists and galleries on secondary sales, <a href="#">read more..</a>
          </mdb-card-text>
          <hr/>
        </mdb-card-body>
          <create-coa :artwork="artwork"  @updateCoa="setByEventCoa($event)"/>
        <mdb-card-body v-if="featureBitcoin">
          <mdb-card-title>Bitcoin Blockchain <span v-if="bitcoinState">(Chain={{bitcoinState.chain}})</span></mdb-card-title>
          <mdb-card-text>
          <canvas id="qrcode" width="150px"></canvas>
          Register artwork on the Bitcoin blockchain here.</mdb-card-text>
          <a class="black-text d-flex justify-content-end"><mdb-btn color="primary" size="sm" :disabled="registered" @click="registerArtworkBitcoin()">Register Bitcoin</mdb-btn></a>
          <hr/>
        </mdb-card-body>
        <mdb-card-body v-if="featureEthereum">
          <mdb-card-title>Ethereum Blockchain <span v-if="bitcoinState">(Network={{networkName}})</span></mdb-card-title>
          <mdb-card-text>Register on ethereum if you use meta mask or another ethereum wallet.</mdb-card-text>
          <a class="black-text d-flex justify-content-end"><mdb-btn v-if="featureEthereum" color="primary" size="sm" :disabled="registered" @click="registerArtworkEthereum()">Register Ethereum ({{networkName}})</mdb-btn></a>
        </mdb-card-body>
      </mdb-card>
    </mdb-col>
  </mdb-row>
</mdb-container>
</template>

<script>
import CreateCoa from "./CreateCoa";
import utils from "@/services/utils";
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";
import bitcoinService from "@/services/bitcoinService";
// import OpenTimestamps from "javascript-opentimestamps";
import { mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import QRCode from "qrcode";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    CreateCoa,
    mdbContainer,
    mdbCol,
    mdbMask,
    mdbView,
    mdbRow,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  data() {
    return {
      message: null,
      artworkId: null,
      from: "/my-artworks"
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    if (this.$route.query.from && this.$route.query.from === "auctions") {
      this.from = "/my-auctions/manage/" + this.$route.query.auctionId;
    }
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];

    this.$store.dispatch("bitcoinStore/fetchBalance");
    this.$store.dispatch("bitcoinStore/fetchClientState");
    let $self = this;
    let $qrCode = document.getElementById("qrcode");
    this.$store.dispatch("artworkSearchStore/fetchUserArtwork", {artworkId: this.artworkId, username: myProfile.username}).then((artwork) => {
      if (artwork && artwork.artistry && artwork.artistry.btcAddress) {
        QRCode.toCanvas(
          $qrCode,
          artwork.artistry.btcAddress,
          { errorCorrectionLevel: "H" },
          function(error) {
            if (error) console.error(error);
            console.log("success!");
          }
        );
      }
    });
  },
  computed: {
    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"];
    },
    networkName() {
      try {
        return this.$store.state.ethStore.clientState.metaMaskNetwork.networkName;
      } catch (err) {
        return "unknown network";
      }
    },
    featureBitcoin() {
      return this.$store.state.constants.featureBitcoin;
    },
    featureEthereum() {
      return this.$store.state.constants.featureEthereum;
    },
    bitcoinState() {
      let state = this.$store.getters["bitcoinStore/getClientState"];
      return state;
    },
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      if (!a.image) {
        a.image = require("@/assets/img/logo/T_8_Symbolmark_white.png");
      }
      return a ? a : {};
    },
    myArtist() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      return this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
    },
    registered() {
      if (!this.artworkId) {
        return false;
      }
      let bcstatus = this.$store.getters["myArtworksStore/bcstatus"](
        this.artworkId
      );
      return bcstatus.itemId > -1;
    },
    canRegister() {
      try {
        let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
          this.artworkId
        );
        return artwork.artwork.length > 0;
      } catch (e) {
        return false;
      }
    }
  },
  methods: {
    closeModal: function() {
      this.$router.push(this.from);
    },
    setByEventCoa (coa) {
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](
        this.artworkId
      );
      artwork.coa = coa;
      this.$store.dispatch("myArtworksStore/updateArtwork", artwork);
    },
    registerArtworkBitcoin: function() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      try {
        let regData = {
          title: artwork.title,
          timestamp: utils.buildBitcoinHash(artwork),
          owner: artwork.owner
        };
        bitcoinService.register(regData,
          function(result) {
          }, function(error) {
          });
      } catch (err) {
        console.log(err);
      }
      /**
      const file = Buffer.from(JSON.stringify(regData), "hex");
      const detached = OpenTimestamps.DetachedTimestampFile.fromBytes(
        new OpenTimestamps.Ops.OpSHA256(),
        file
      );
      OpenTimestamps.stamp(detached).then(() => {
        // const fileOts = detached.serializeToBytes()
        const infoResult = OpenTimestamps.info(detached);
        console.log(infoResult);
      });
      **/
    },
    registerArtworkEthereum: function() {
      this.message =
        "Registering your artwork - please allow a few minutes for the transaction to complete...";
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](
        this.artworkId
      );
      if (!artwork || !artwork.id) {
        return;
      }
      let uploader = this.$store.getters["myAccountStore/getMyProfile"]
        .username;
      let regData = {
        title: artwork.title,
        timestamp: utils.buildArtworkHash(artwork.artwork[0].dataUrl),
        uploader: uploader
      };
      let $self = this;
      ethereumService.registerOnChain(
        regData,
        function(result) {
          notify.info({
            title: "Register Artwork.",
            text: "Transaction sent to the blockchain..."
          });
          artwork.bcitem = {
            registerTxId: result.txId,
            status: "pending-register"
          };
          $self.$store.commit("myArtworksStore/addMyArtwork", artwork);
          $self.$store
            .dispatch("myArtworksStore/updateArtwork", artwork)
            .then(artwork => {
              notify.info({
                title: "Register Artwork.",
                text: "User storage has been updated..."
              });
              $self.$store
                .dispatch("myArtworksStore/syncBlockchainState", artwork)
                .then(() => {});
              $self.closeModal();
            });
        },
        function(error) {
          console.log(error);
          $self.message =
            "Please check you are logged into your Meta Mask account and on the correct network.";
          notify.error({
            title: "Register Artwork.",
            text:
              "Error registering your item - please check meta mask is running and unlocked. <br>"
          });
        }
      );
    }
  }
};
</script>
