<template>
<mdb-card-body>
  <mdb-card-title>Payment Details</mdb-card-title>
  <mdb-card-title class="text-danger">UNDER CONSTRUCTION</mdb-card-title>
  <mdb-card-title class="text-danger">ON BITCOIN TEST NET</mdb-card-title>
  <mdb-card-text>
    <div class="row text-center">
      <div class="col-md-12">{{clientState.chain}}</div>
      <div class="col-md-12">{{balance}}</div>
      <div class="col-md-6">
        <div class="row text-center">
          <div class="col-md-12">
            <canvas id="qrcode1" max-width="150px"></canvas>
          </div>
          <div class="col-md-12">Owner: {{ownerAddress}}</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row text-center">
          <div class="col-md-12">
            <canvas id="qrcode2" max-width="150px"></canvas>
          </div>
          <div class="col-md-12">Artist: {{artistAddress}}</div>
        </div>
      </div>
    </div>
  </mdb-card-text>
</mdb-card-body>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import QRCode from "qrcode";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentDetails",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    artwork: {}
  },
  data() {
    return {
      clientState: {},
      balance: null,
      ownerAddress: null,
      artistAddress: null,
    };
  },
  mounted() {
    this.balance = this.$store.getters["bitcoinStore/getBalance"];
    this.clientState = this.$store.getters["bitcoinStore/getClientState"];
    this.myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    let artist = this.artwork.artist;
    let owner = this.artwork.owner;
    this.$store.dispatch("userProfilesStore/fetchUserProfile", { username: this.artwork.artist}).then(profile => {
      if (profile.portrayal.bitcoinAddress) {
        this.artistAddress = profile.portrayal.bitcoinAddress;
        this.addQrCode("qrcode2", this.artistAddress);
      }
    });
    if (artist !== owner) {
      this.$store.dispatch("userProfilesStore/fetchUserProfile", { username: this.artwork.owner}).then(profile => {
        if (profile.portrayal.bitcoinAddress) {
          this.ownerAddress = profile.portrayal.bitcoinAddress;
          this.addQrCode("qrcode1", this.ownerAddress);
        }
      });
    }
  },
  computed: {
  },
  methods: {
    addQrCode(qrc, bitcoinAddress) {
      let $self = this;
      let $qrCode = document.getElementById(qrc);
      QRCode.toCanvas(
        $qrCode, bitcoinAddress, { errorCorrectionLevel: "H" },
        function(error) {
          if (error) console.error(error);
          console.log("success!");
        }
      );
    }
  }
};
</script>
