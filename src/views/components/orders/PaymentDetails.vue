<template>
<div class="row text-center">
  <div class="col-md-12 pt-3">
    <a :href="bitcoinUri" class="btn btn-block btn-sm text-white teal lighten-1">OPEN IN WALLET</a>
  </div>
  <div class="col-md-12">
    <img class="img-fluid" :src="qrImage" alt="artwork.title" style="width: 90%;">
    <canvas id="qrcode1"></canvas>
  </div>
  <div class="col-md-12 text-left pl-5 muted">
    Pay with QR code or
    <br/><a :href="bitcoinUri" class="teal-text darken-3 muted">Click payment link</a>
  </div>
</div>
</template>

<script>
import xhrService from "@/services/xhrService";
import QRCode from "qrcode";
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentDetails",
  components: {
  },
  props: {
    bitcoinUri: null,
    invoiceClaim: null
  },
  data() {
    return {
      qrImage: require("@/assets/img/missing/artwork-missing.jpg")
    };
  },
  mounted() {
    if (this.bitcoinUri) {
      this.addQrCode("qrcode1", this.bitcoinUri);
    }
  },
  computed: {
    image() {
      let $qrCode = document.getElementById("qrcode1");
      let qrImage = $qrCode.toDataURL();
      qrImage = $self.qrImage.substring(22);
      if (qrImage) {
        return qrImage;
      }
      return image1;
    },
  },
  methods: {
    addQrCode(qrc, bitcoinUri) {
      let $qrCode = document.getElementById(qrc);
      let $self = this;
      let qrCanvas = QRCode.toCanvas(
        $qrCode, bitcoinUri, { errorCorrectionLevel: "H" },
        function(error) {
          if (error) console.error(error);
          console.log("success!");
          $self.qrImage = $qrCode.toDataURL();
          $qrCode.style.display = "none";
          //$self.qrImage = $self.qrImage.substring(22);
        }
      );
    },
    sentPayment() {
      this.$emit("paymentSent");
    }
  }
};
</script>
