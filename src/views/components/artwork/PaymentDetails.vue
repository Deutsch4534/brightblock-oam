<template>
<mdb-card-body>
  <mdb-card-title>
    <mdb-popover trigger="click" :options="{placement: 'top'}">
      <div class="popover">
        <div class="popover-header">
          Rad.Pay
        </div>
        <div class="popover-body">
        Payment is held in escrow until the transaction is fully completed.
        </div>
        <div class="popover-body">
        This allows us to automate payment of refunds in cases of dispute and also to
        seemlessly transfer provenance from seller to buyer.
        </div>
      </div>
      <a @click.prevent="" slot="reference">
        RaPay <mdb-icon far icon="question-circle" />
      </a>
    </mdb-popover>
  </mdb-card-title>
  <mdb-card-text>
    Please pay the invoice below using your bitcoin wallet.
  </mdb-card-text>
  <mdb-card-text>
  <div class="row">
    <div class="col-12 mb-5" @click="closeModal">
      <mdb-btn type="submit" size="md" class="btn-main btn-block">Click here when paid</mdb-btn>
    </div>
  </div>
  <div class="w-100"></div>
    <div class="row text-center">
      <div class="col-md-12">
        <div class="row text-center">
          <div class="col-md-12">
            <canvas id="qrcode1" max-width="150px"></canvas>
          </div>
          <div class="col-md-12">{{bitcoinUri}}</div>
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
import moneyUtils from "@/services/moneyUtils";

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
    artwork: {},
    bitcoinUri: null
  },
  data() {
    return {
    };
  },
  mounted() {
    if (this.bitcoinUri) {
      this.addQrCode("qrcode1", this.bitcoinUri);
    }
    /**
    this.balance = this.$store.getters["bitcoinStore/getBalance"];
    this.bitcoinState = this.$store.getters["bitcoinStore/getBitcoinState"];
    this.myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    let artist = this.artwork.artist;
    let owner = this.artwork.owner;
    this.$store.dispatch("userProfilesStore/fetchUserProfile", { username: this.artwork.owner}).then(profile => {
      if (profile.publicKeyData.bitcoinAddress) {
        this.ownerAddress = profile.publicKeyData.bitcoinAddress;
        this.addQrCode("qrcode1", this.ownerAddress);
      }
    });
    if (artist !== owner) {
      this.$store.dispatch("userProfilesStore/fetchUserProfile", { username: this.artwork.artist}).then(profile => {
        if (profile.publicKeyData.bitcoinAddress) {
          this.artistAddress = profile.publicKeyData.bitcoinAddress;
          this.addQrCode("qrcode2", this.artistAddress);
        }
      });
    }
    **/
  },
  computed: {
    showArtist() {
      return this.artwork.artist !== this.artwork.owner;
    },
  },
  methods: {
    addQrCode(qrc, bitcoinUri) {
      let $qrCode = document.getElementById(qrc);
      QRCode.toCanvas(
        $qrCode, bitcoinUri, { errorCorrectionLevel: "H" },
        function(error) {
          if (error) console.error(error);
          console.log("success!");
        }
      );
    },
    closeModal() {
      this.$emit("registerPayment");
    }
  }
};
</script>
