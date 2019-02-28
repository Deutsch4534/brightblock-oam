<template>
<mdb-card-text>
  <mdb-popover trigger="click" :options="{placement: 'top'}">
    <div class="popover">
      <div class="popover-header">
        Public Bitcoin Address
      </div>
      <div class="popover-body">
        We use your bitcoin address for the following;
        <ul>
          <li>For payments to be made to your bitcoin wallet.</li>
          <li>For generating certificates of authenticity for artwork.</li>
        </ul>
      </div>
      <div class="popover-body">
        You'll need a bitcoin wallet to use radicle. We use the
        <a href="https://electrum.org" target="_blank">electrum wallet <mdb-icon icon="external-link-alt" /></a>
        and the <a href="https://bitcoin.org/en/download">bitcoin core <mdb-icon icon="external-link-alt" /></a> wallets to test the site.
      </div>
    </div>
    <a @click.prevent="" slot="reference">
      Public <span class="text-danger">Testnet</span> Bitcoin Address <mdb-icon far icon="question-circle" />
    </a>
  </mdb-popover>
  <p>Your
   will be embedded in your certificate of authenticity to make it easy
  to receive future payments.</p>
  <div class="row text-center">
    <div class="col-md-12" v-if="myProfile.publicKeyData.bitcoinAddress">
      <canvas id="qrcode" max-width="150px"></canvas>
    </div>
    <div class="col-md-12" v-if="myProfile.publicKeyData.bitcoinAddress">
      {{myProfile.publicKeyData.bitcoinAddress}} <a @click.prevent="toggleAddressInput"><mdb-icon icon="pen" /></a>
    </div>
    <div class="col-md-12 text-danger" v-if="message">
      <p>{{message}}</p>
    </div>
    <div class="col-md-12" v-if="changeBtcAddress">
      <input type="text" width="50%" class="form-control" required id="vc-bitcoin-address" placeholder="Your bitcoin address" v-on:keyup.13="saveBitcoinAddress($event)" v-model="myProfile.publicKeyData.bitcoinAddress">
    </div>
  </div>
</mdb-card-text>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import bitcoinService from "@/services/bitcoinService";
import QRCode from "qrcode";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BitcoinAddressEntry",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  props: {
    myProfile: {
      publicKeyData: {
        bitcoinAddress: null
      }
    },
  },
  data() {
    return {
      changeBtcAddress: true,
      message: null,
    };
  },
  mounted() {
    if (this.myProfile.publicKeyData.bitcoinAddress) {
      // this.addQrCode(this.myProfile.publicKeyData.bitcoinAddress);
      this.checkBitcoinAddress(this.myProfile.publicKeyData.bitcoinAddress);
    }
  },
  computed: {
  },
  methods: {
    saveBitcoinAddress: function(event) {
      if (event) event.preventDefault();
      let bitcoinAddress = this.myProfile.publicKeyData.bitcoinAddress;
      this.checkBitcoinAddress(bitcoinAddress);
    },
    toggleAddressInput: function() {
      this.changeBtcAddress = !this.changeBtcAddress;
      this.message = null;
    },
    checkBitcoinAddress(bitcoinAddress) {
      let $self = this;
      bitcoinService.checkAddress({address: bitcoinAddress}, function(result) {
        if (result) {
          let blockstackProfile = $self.$store.getters["myAccountStore/getMyProfile"];
          let publicKeyData = blockstackProfile.publicKeyData;
          publicKeyData.bitcoinAddress = bitcoinAddress;
          $self.addQrCode(bitcoinAddress);
          $self.$emit("bitcoinAddressUpdate", true);
          $self.$store.dispatch("myAccountStore/updatePublicKeyData", publicKeyData);
          $self.message = null;
        } else {
          $self.message = "Invalid address - is it the right key for the current bitcoin network?";
        }
      });
    },
    addQrCode(bitcoinAddress) {
      let $qrCode = document.getElementById("qrcode");
      if (bitcoinAddress) {
        this.changeBtcAddress = false;
        QRCode.toCanvas(
          $qrCode, bitcoinAddress, { errorCorrectionLevel: "H" },
          function(error) {
            if (error) console.error(error);
            console.log("success!");
          }
        );
      }
    },
  }
};
</script>
<style>

</style>
<style scoped>
</style>
