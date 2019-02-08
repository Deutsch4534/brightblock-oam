<template>
<mdb-card-body>
  <mdb-card-title>Certificate of Authenticity</mdb-card-title>
  <h5>{{artwork.title}}</h5>
  <mdb-card-text>
    <p>Your bitcoin address will be embedded in your certificate of authenticity to make it easy
    to receive future payments.</p>
    <div class="row text-center">
      <div class="col-md-12">
        <canvas id="qrcode" width="150px"></canvas>
      </div>
      <div class="col-md-12">
        {{artwork.artistry.btcAddress}}
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
import { mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import QRCode from "qrcode";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn
  },
  data() {
    return {
      result: null,
      artworkId: null,
      downloadLink: null,
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    let $self = this;
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      let $qrCode = document.getElementById("qrcode");
      this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId).then((artwork) => {
        if (artwork) {
          if (artwork && artwork.artistry && artwork.artistry.btcAddress) {
            QRCode.toCanvas(
              $qrCode,
              artwork.artistry.btcAddress,
              { errorCorrectionLevel: "H" },
              function(error) {
                if (error) console.error(error);
                console.log("success!");
              }
            );
          }
        }
      });
    });
  },
  computed: {
    artwork() {
      let a = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      if (!a.image) {
        a.image = require("@/assets/img/logo/T_8_Symbolmark_white.png");
      }
      return a ? a : {};
    }
  },
  methods: {
    setByEventCoa (coa) {
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](
        this.artworkId
      );
      artwork.coa = coa;
      this.$store.dispatch("myArtworksStore/updateArtwork", artwork);
    },
    generateCoa: function() {
      let canvas = document.getElementById('qrcode');
      let qrCodeDataUrl = canvas.toDataURL();
      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      let $self = this;
      let siteLogo = require("@/assets/img/logo/T_8_Symbolmark_black.png");
      let data = {
        artwork: artwork,
        qrCodeDataUrl: qrCodeDataUrl,
        siteName: "Transit8",
        siteLogo: siteLogo
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
