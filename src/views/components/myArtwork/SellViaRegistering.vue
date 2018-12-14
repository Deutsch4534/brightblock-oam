<template>
<div>
  <md-dialog :md-active.sync="showModal">
    <md-dialog-title>Register Artwork</md-dialog-title>
    <md-dialog-content>
      {{message}}
    </md-dialog-content>
    <md-dialog-content>
      <img :src="artwork.image" :alt="artwork.title">
      <h4>{{artwork.title}}</h4>
      <p>{{myArtist.name}}</p>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" :disabled="status !== 'new'" @click="registerArtworkBitcoin()" v-if="!message">Register Bitcoin</md-button>
      <md-button class="md-primary" :disabled="status !== 'new'" @click="registerArtworkEthereum()" v-if="!message">Register Ethereum</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
import utils from "@/services/utils";
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";
import OpenTimestamps from "javascript-opentimestamps";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellViaRegistering",
  props: {
    showRegisterModal: false,
    artwork: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    // can pass old/ new values in here.
    showRegisterModal() {
      this.showModal = !this.showModal;
    }
  },
  data() {
    return {
      message: null,
      showModal: false
    };
  },
  mounted() {},
  computed: {
    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"];
    },
    myArtist() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.artist
      );
    },
    status() {
      return this.$store.getters["myArtworksStore/bcstatus"](this.artworkId);
    }
  },
  methods: {
    registerArtworkBitcoin: function() {
      let regData = {
        title: this.artwork.title,
        timestamp: utils.buildArtworkHash(this.artwork.artwork[0].dataUrl),
        uploader: this.artwork.owner
      };
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
    },
    registerArtworkEthereum: function() {
      this.message =
        "Registering your artwork - please allow a few minutes for the transaction to complete...";
      let artwork = this.artwork;
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
              $self.closeModal();
              $self.$store
                .dispatch("myArtworksStore/syncBlockchainState", artwork)
                .then(artwork => {
                  if (artwork) {
                    $self.artwork = artwork;
                  }
                });
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
