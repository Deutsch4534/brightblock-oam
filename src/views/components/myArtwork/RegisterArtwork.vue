<template>
<mdb-modal size="lg" @close="closeModal">
    <mdb-modal-header>
        <mdb-modal-title>Register Artwork</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body>
      {{message}}
    </mdb-modal-body>
    <mdb-modal-body>
      <img :src="artwork.image" :alt="artwork.title" class="img-fluid">
      <h4>{{artwork.title}}</h4>
      <p>{{myArtist.name}}</p>
    </mdb-modal-body>
    <mdb-modal-footer v-if="!message">
        <mdb-btn v-if="bitcoin" color="primary" size="sm" :disabled="registered" @click="registerArtworkBitcoin()">Register Bitcoin</mdb-btn>
        <mdb-btn v-else color="primary" size="sm" :disabled="registered" @click="registerArtworkEthereum()">Register Ethereum ({{networkName}})</mdb-btn>
    </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import utils from "@/services/utils";
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";
// import OpenTimestamps from "javascript-opentimestamps";
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "RegisterArtwork",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
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
  },
  computed: {
    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"];
    },
    networkName() {
      return this.$store.state.ethStore.clientState.metaMaskNetwork.networkName;
    },
    bitcoin() {
      return this.$store.state.constants.blockchain === "bitcoin";
    },
    artwork() {
      return this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
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
    registerArtworkBitcoin: function() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      let regData = {
        title: artwork.title,
        timestamp: utils.buildArtworkHash(artwork.artwork[0].dataUrl),
        uploader: artwork.owner
      };
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
