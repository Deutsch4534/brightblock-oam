<template>
<div>
  <md-dialog :md-active.sync="showModal" @md-closed="closeModal">
    <md-dialog-title>Register Artwork</md-dialog-title>
    <md-dialog-content>
      {{message}}
    </md-dialog-content>
    <md-dialog-content>
      <img :src="artwork.image" :alt="artwork.title">
      <h4>{{artwork.title}}</h4>
      <p>{{myArtist.name}}</p>
    </md-dialog-content>
    <md-dialog-actions v-if="canRegister">
      <!--
      <md-button class="md-primary" :disabled="registered" @click="registerArtworkBitcoin()" v-if="!message">Register Bitcoin</md-button>
      -->
      <md-button class="md-primary" :disabled="registered" @click="registerArtworkEthereum()" v-if="!message">Register Ethereum</md-button>
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
  name: "RegisterArtwork",
  data() {
    return {
      message: null,
      showModal: true,
      artworkId: null,
      artwork: {
        type: Object,
        default() {
          return {};
        }
      }
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.artwork = this.$store.getters["myArtworksStore/myArtwork"](
      this.artworkId
    );
    if (this.artwork.artwork && this.artwork.artwork.length === 0) {
      this.message = "please attach an artwork.";
    }
  },
  computed: {
    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"];
    },
    myArtist() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.artwork.artist
      );
    },
    registered() {
      let bcstatus = this.$store.getters["myArtworksStore/bcstatus"](
        this.artworkId
      );
      return bcstatus.itemId > -1;
    },
    canRegister() {
      try {
        return this.artwork.artwork.length > 0;
      } catch (e) {
        return false;
      }
    }
  },
  methods: {
    closeModal: function() {
      this.showModal = false;
      this.$router.push("/my-artworks");
    },
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
              $self.$store
                .dispatch("myArtworksStore/syncBlockchainState", artwork)
                .then(artwork => {
                  if (artwork) {
                    $self.artwork = artwork;
                  }
                });
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
