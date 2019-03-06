<template>
<mdb-card-body>
  <mdb-card-title>
    <mdb-popover trigger="click" :options="{placement: 'top'}">
      <div class="popover">
        <div class="popover-header">
          Bitcoin Blockchain
        </div>
        <div class="popover-body">
          The bitcoin address of the artist can be displayed in the certificate of authenticity
          of the artwork.
        </div>
      </div>
      <a @click.prevent="" slot="reference">
        Bitcoin Registration <span v-if="bitcoinState">({{bitcoinState.chain}} chain)</span>
      </a>
    </mdb-popover>
  </mdb-card-title>
  <mdb-card-text>
    We will create a piece of data that is unique to you and this piece of artwork
    and store it the bitcoin blockchain where it can be used to prove your
    ownership. You'll then be able to generate a Certificate of Ownership.
    <br/><br/>
    <a @click.prevent="showArtworkHash = !showArtworkHash">Show this data!</a>
  </mdb-card-text>
  <mdb-card-text v-if="showArtworkHash">
    {{artworkHash}}
  </mdb-card-text>
  <a class="black-text d-flex justify-content-end" v-if="!bitcoinTx"><mdb-btn color="primary" size="md" @click="registerArtworkBitcoin()">Register Bitcoin</mdb-btn></a>
  <hr/>
</mdb-card-body>
</template>

<script>
import utils from "@/services/utils";
import notify from "@/services/notify";
import moment from "moment";
import bitcoinService from "@/services/bitcoinService";
import { mdbPopover, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
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
      bitcoinTx: null,
      showArtworkHash: null,
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    let $self = this;
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId).then(artwork => {
        this.bitcoinTx = artwork.bitcoinTx;
      });
    });
  },
  computed: {
    artworkHash() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      return utils.buildBitcoinHash(artwork);
    },
    bitcoinState() {
      let state = this.$store.getters["bitcoinStore/getBitcoinState"];
      return state;
    },
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      if (!a.image) {
        a.image = require("@/assets/img/logo/logo-black-256x256.png");
      }
      return a ? a : {};
    },
    myArtist() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      return this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
    },
    canRegister() {
      try {
        let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
        return artwork.artwork.length > 0;
      } catch (e) {
        return false;
      }
    }
  },
  methods: {
    registerArtworkBitcoin: function() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      this.modal = true;
      try {
        let regData = {
          title: artwork.title,
          timestamp: moment({}),
          artworkHash: utils.buildBitcoinHash(artwork),
          owner: artwork.owner
        };
        let $self = this;
        bitcoinService.registerTx(regData,
          function(result) {
            $self.artwork.bitcoinTx = result.sentTx;
            $self.$store.dispatch("myArtworksStore/updateArtwork", artwork);
            $self.$emit("registerStatusUpdate", result.sentTx);
          }, function(error) {
            $self.$emit("registerStatusUpdate", error);
            console.log(error);
          });
      } catch (err) {
        $self.$emit("registerStatusUpdate", error);
        console.log(err);
      }
    },
  }
};
</script>
