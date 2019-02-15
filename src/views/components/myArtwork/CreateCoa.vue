<template>
<mdb-card-body>
  <mdb-card-title>Certificate of Authenticity</mdb-card-title>
  <h5>{{artwork.title}}</h5>
  <mdb-card-text>
    <p>Your artwork has been <a :href="blockchainInfoUrl()" target="_blank">registered</a> with the Bitcoin blockchain.</p>
  </mdb-card-text>
  <mdb-card-text>
    <p>Your
    <mdb-popover trigger="click" :options="{placement: 'top'}">
      <div class="popover">
        <div class="popover-header">
          bitcoin address
        </div>
        <div class="popover-body">
          Enter your bitcoin address for people to make payments and donations. We will embed the qrcode of your
          address in the Certificate of Authenticity for your artwork.
        </div>
      </div>
      <a @click.prevent="" slot="reference">
        bitcoin address <mdb-icon far icon="question-circle" />
      </a>
    </mdb-popover>
     will be embedded in your certificate of authenticity to make it easy
    to receive future payments.</p>
    <div class="row text-center">
      <div class="col-md-12">
        <canvas id="qrcode" max-width="150px"></canvas>
      </div>
      <div class="col-md-12" v-if="bitcoinAddress">
        {{bitcoinAddress}} <a @click.prevent="changeBtcAddress = !changeBtcAddress"><mdb-icon icon="pen" /></a>
      </div>
      <div class="col-md-12" v-if="changeBtcAddress">
        <input type="text" width="50%" class="form-control" id="validationCustom01-1" placeholder="Your bitcoin address" v-on:keyup.13="saveBitcoinAddress" v-model="bitcoinAddress">
      </div>
    </div>
  </mdb-card-text>
  <div class="rounded-bottom lighten-3 text-right p-3">
    <a class="black-text" @click.prevent="generateCoa()"><mdb-btn color="primary" size="md">Generate COA</mdb-btn></a>
    <a v-if="downloadLink" :href="downloadLink" _target="blank" class="black-text"><mdb-btn color="primary" size="md">Download PDF</mdb-btn></a>
    <a v-if="artwork.coa" class="black-text" @click.prevent="openCoa()"><mdb-btn color="primary" size="md">Open COA</mdb-btn></a>
  </div>
</mdb-card-body>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import QRCode from "qrcode";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  data() {
    return {
      result: null,
      artworkId: null,
      downloadLink: null,
      bitcoinAddress: null,
      changeBtcAddress: true
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    let $self = this;
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      if (myProfile.portrayal.bitcoinAddress) {
        this.bitcoinAddress = myProfile.portrayal.bitcoinAddress;
        this.addQrCode(this.bitcoinAddress);
      }
      this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId);
    });

    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
    });
  },
  computed: {
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      if (!a.image) {
        a.image = require("@/assets/img/logo/logo-black-256x256.png");
      }
      return a ? a : {};
    },
    featureBitcoin() {
      return this.$store.state.constants.featureBitcoin;
    },
  },
  methods: {
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
    setByEventCoa (coa) {
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](
        this.artworkId
      );
      artwork.coa = coa;
      this.$store.dispatch("myArtworksStore/updateArtwork", artwork);
    },
    blockchainInfoUrl() {

      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      let state = this.$store.getters["bitcoinStore/getClientState"];
      if (state.chain === "test") {
        return `https://testnet.blockexplorer.com/tx/${artwork.saleData.bitcoinTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${artwork.saleData.bitcoinTx}`;
    },
    saveBitcoinAddress: function() {
      if (this.bitcoinAddress) {
        let blockstackProfile = this.$store.getters["myAccountStore/getMyProfile"];
        let portrayal = blockstackProfile.portrayal;
        portrayal.bitcoinAddress = this.bitcoinAddress;
        this.$store.dispatch("myAccountStore/updatePortrayal", portrayal)
          .then(portrayal => {
            this.addQrCode(this.bitcoinAddress);
            this.$router.push("/my-artwork/upload");
          });
      }
    },
    generateCoa: function() {
      let canvas, qrCodeDataUrl;
      try {
        canvas = document.getElementById('qrcode');
        qrCodeDataUrl = canvas.toDataURL();
      } catch (err) {
        // no canvas - ie bitcoin address.
      }
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      let $self = this;
      let siteLogo = require("@/assets/img/logo/logo-black-256x256.png");
      let data = {
        artwork: artwork,
        qrCodeDataUrl: qrCodeDataUrl,
        siteName: "Radicle Art",
        siteLogo: siteLogo,
      }
      let endPoint = this.$store.state.constants.ethGatewayUrl + "/api/convert/coa";
      xhrService.makePostCall(endPoint, data).then((response) => {
        $self.downloadLink = $self.getPdfLink(artwork);
        // $self.$emit('updateCoa', response.data);
        $self.setByEventCoa(response.data);
      });
    },
    getPdfLink: function(artwork) {
      let url = this.$store.state.constants.ethGatewayUrl + "/api/getpdf/";
      if (artwork) {
        let title = artwork.title;
        title = title.replace(/\s/g, '_');
        let filename = title + "_" + artwork.id + ".pdf";
        return url + filename;
      }
    },
    /**
    getPdfLink () {
      let pdfWindow = window.open("");
      pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + (this.coa)+"'></iframe>");
    },
    **/
    openCoa () {
      /**
      var downloadLink      = document.createElement('a');
      downloadLink.target   = '_blank';
      downloadLink.download = 'name_to_give_saved_file.pdf';
      var blob = new Blob([this.coa], {type: "application/pdf"})
      var URL = window.URL || window.webkitURL;
      var downloadUrl = URL.createObjectURL(blob);
      downloadLink.href = downloadUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
      **/

      // window.open("data:application/pdf, " + (this.coa));

      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      let pdfWindow = window.open("")
      pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(a.coa)+"'></iframe>")
    },
  }
};
</script>
