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
        Artwork Registration <span v-if="bitcoinState">({{bitcoinState.chain}} chain)</span>
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
  <a class="black-text d-flex justify-content-end" v-if="!artwork.bitcoinTx"><mdb-btn class="btn teal lighten-1" size="md" @click="registerArtworkBitcoin()">Register Bitcoin</mdb-btn></a>
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
  props: {
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      message: null,
      artworkId: null,
      showArtworkHash: null,
    };
  },
  mounted() {
  },
  computed: {
    artworkHash() {
      return utils.buildBitcoinHash(this.artwork);
    },
    bitcoinState() {
      let state = this.$store.getters["bitcoinStore/getBitcoinState"];
      return state;
    },
    myArtist() {
      return this.$store.getters["userProfilesStore/getProfile"](this.artwork.artist);
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
    registerArtworkBitcoin: function() {
      let artwork = this.artwork;
      this.modal = true;
      try {
        let regData = {
          title: artwork.title,
          timestamp: moment({}),
          artworkHash: utils.buildBitcoinHash(artwork),
          owner: artwork.owner
        };
        let $self = this;
        $self.$emit("registerBitcoin", {error: false, message: "Registering please wait.."});
        bitcoinService.registerTx(regData,
          function(result) {
            if (!result || !result.sentTx) {
              $self.$emit("registerBitcoin", {error: true, message: "transaction failed - please try again later."});
            } else {
              $self.artwork.bitcoinTx = result.sentTx;
              $self.$store.dispatch("myArtworksStore/updateArtwork", artwork);
              $self.$emit("registerBitcoin", {error: false, message: "Registered on bitcoin."});
            }
          }, function(error) {
            $self.$emit("registerBitcoin", {error: true, message: "transaction failed"});
            console.log(error);
          });
      } catch (err) {
        $self.$emit("registerBitcoin", {error: true, message: "transaction failed - please try again later."});
        console.log(err);
      }
    },
  }
};
</script>
