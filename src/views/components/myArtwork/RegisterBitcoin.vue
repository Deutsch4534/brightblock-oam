<template>
<mdb-card-body v-if="featureBitcoin">
  <mdb-card-title>
  <mdb-popover trigger="click" :options="{placement: 'top'}">
    <div class="popover">
      <div class="popover-header">
        Bitcoin Blockchain
      </div>
      <div class="popover-body">
        We display your bitcoin address with your artwork and in your certificate of authenticity
        to maximise your income from your artwork.
      </div>
    </div>
    <a @click.prevent="" slot="reference">
      Bitcoin Address
    </a>
  </mdb-popover>
   <span v-if="bitcoinState">({{bitcoinState.chain}} chain)</span></mdb-card-title>
  <mdb-card-text>
  <p>RawTx (artwork) {{artwork.btcData.bitcoinTx}}</p>
  <p>RawTx: {{bitcoinTx}}</p>
  Register artwork on the Bitcoin blockchain here.</mdb-card-text>
  <a class="black-text d-flex justify-content-end"><mdb-btn color="primary" size="md" :disabled="registered" @click="registerArtworkBitcoin()">Register Bitcoin</mdb-btn></a>
  <hr/>
</mdb-card-body>
</template>

<script>
import CreateCoa from "./CreateCoa";
import utils from "@/services/utils";
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";
import bitcoinService from "@/services/bitcoinService";
// import OpenTimestamps from "javascript-opentimestamps";
import { mdbPopover, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    CreateCoa,
    mdbPopover,
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
      from: "/my-artworks",
      bitcoinTx: null
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    let $self = this;
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId).then((artwork) => {
        if (artwork) {
          if (artwork && artwork.artistry && artwork.artistry.btcAddress) {
          }
        }
      });
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
    btcAddress() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      return a.artistry.btcAddress;
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
      // moved to child - we just update the store so no need for parent to know.
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
        let $self = this;
        bitcoinService.registerTx(regData,
          function(result) {
            $self.bitcoinTx = result.sentTx;
            artwork.btcData.bitcoinTx = result.sentTx;
            $self.$store.dispatch("myArtworksStore/updateArtwork", artwork);
            $self.decodedTransaction = JSON.parse(result.decodedTransaction);
          }, function(error) {
            console.log(error);
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
