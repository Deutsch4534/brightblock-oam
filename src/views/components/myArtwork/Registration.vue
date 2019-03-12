<template>
<mdb-container>
  <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
  <mdb-row class="mt-5">
    <mdb-col sm="10" class="mx-auto">
    <h1>Artwork Registration</h1>
    <hr/>
    </mdb-col>
    <mdb-col sm="10" class="mx-auto">
      <mdb-card>
        <mdb-card-title>{{artwork.title}}</mdb-card-title>
        <mdb-card-title class="text-right"><small>{{myArtist.name}}</small></mdb-card-title>
          <mdb-card-text>
            <p>A <a @click.prevent="showArtworkHash = !showArtworkHash">hash of your artwork</a> has been
            <a :href="blockchainInfoUrl()" target="_blank">registered</a> with the Bitcoin blockchain.</p>
          </mdb-card-text>
          <mdb-card-text v-if="showArtworkHash">
            {{artworkHash}}
          </mdb-card-text>

        <create-coa v-if="artwork.bitcoinTx"/>

        <register-bitcoin v-if="!artwork.bitcoinTx" @registerStatusUpdate="updateRegisterStatus"/>


        <mdb-view hover>
          <img class="img-fluid" width="100%" :src="artwork.image" :alt="artwork.title"></img>
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
      </mdb-card>
    </mdb-col>
  </mdb-row>
</mdb-container>
</template>

<script>
import CreateCoa from "./CreateCoa";
import RegisterBitcoin from "./RegisterBitcoin";
import utils from "@/services/utils";
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";
import bitcoinService from "@/services/bitcoinService";
// import OpenTimestamps from "javascript-opentimestamps";
import { mdbPopover, mdbCol, mdbView, mdbMask, mdbRow, mdbContainer, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import ConfirmationModal from "../utils/ConfirmationModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    CreateCoa,
    ConfirmationModal,
    RegisterBitcoin,
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
      showArtworkHash: false,
      showModal: false,
      modalTitle: "Registering Ownership",
      modalContent: "<p>Transaction sent - confirmation takes ~ 6 blocks which is about an hour..</p>" +
            "<p>Once confirmed you'll be able to generate Certificate of Authenticity.</p>",
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    if (this.$route.query.from && this.$route.query.from === "auctions") {
      this.from = "/my-auctions/manage/" + this.$route.query.auctionId;
    }
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.$store.dispatch("bitcoinStore/fetchBalance");
    this.$store.dispatch("bitcoinStore/fetchBitcoinState");
  },
  methods: {
    closeModal: function() {
      this.showModal = false;
    },
    blockchainInfoUrl() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      let state = this.$store.getters["bitcoinStore/getBitcoinState"];
      if (state.chain === "test") {
        return `https://testnet.blockexplorer.com/tx/${artwork.bitcoinTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${artwork.bitcoinTx}`;
    },
    updateRegisterStatus(transaction) {
      this.showModal = true;
    },
  },
  computed: {
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      if (!a.image) {
        a.image = require("@/assets/img/missing/artwork-missing.jpg");
      }
      return a ? a : {};
    },
    artworkHash() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      return utils.buildBitcoinHash(artwork);
    },
    showCoa() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      return artwork.bitcoinTx;
    },
    myArtist() {
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](this.artworkId);
      return this.$store.getters["userProfilesStore/getProfile"](
        artwork.artist
      );
    }
  }
};
</script>
