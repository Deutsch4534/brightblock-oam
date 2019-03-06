<template>
<mdb-card-body>
  <mdb-card-title>Certificate of Authenticity</mdb-card-title>
  <h5>{{artwork.title}}</h5>
  <mdb-card-text>
    <p>Your artwork has been <a :href="blockchainInfoUrl()" target="_blank">registered</a> with the Bitcoin blockchain.</p>
  </mdb-card-text>
  <bitcoin-address-entry v-if="showBitcoinAddress" @bitcoinAddressUpdate="updateBitcoinAddress"/>
  <div class="rounded-bottom lighten-3 text-right p-3" v-if="validBitcoinAdress">
    <a v-if="artwork.coa" class="black-text" @click.prevent="openCoa()"><mdb-btn color="primary" size="md">Open COA</mdb-btn></a>
    <a v-else class="black-text" @click.prevent="generateCoa()"><mdb-btn color="primary" size="md">Generate COA</mdb-btn></a>
    <!--
    <a v-if="downloadLink" :href="downloadLink" _target="blank" class="black-text"><mdb-btn color="primary" size="md">Download PDF</mdb-btn></a>
    <router-link :to="registerForSaleUrl()" class="inline-block" v-if="artwork.coa">
      <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light">Sell</mdb-btn>
    </router-link>
    -->
  </div>
</mdb-card-body>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import BitcoinAddressEntry from "../utils/BitcoinAddressEntry";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Registration",
  components: {
    BitcoinAddressEntry,
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
      showBitcoinAddress: false,
      validBitcoinAdress: false,
      message: null,
      myProfile: {}
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    let $self = this;
    this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
      this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId);
      this.myProfile = myProfile;
      this.showBitcoinAddress = true;
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
    hasBitcoinAddress() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.publicKeyData.bitcoinAddress;
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
    updateBitcoinAddress(newAddress) {
      this.validBitcoinAdress = newAddress;
    },
    blockchainInfoUrl() {

      let artwork = this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
      let state = this.$store.getters["bitcoinStore/getBitcoinState"];
      if (state.chain === "test") {
        return `https://testnet.blockexplorer.com/tx/${artwork.bitcoinTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${artwork.bitcoinTx}`;
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
    registerForSaleUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](this.artworkId);
      let id = this.artworkId;
      if (a.saleData || !a.saleData.soid) {
        let amount = 0;
        let currency = "EUR";
        return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      } else if (a.saleData.soid <= 1) {
        let amount = a.saleData ? a.saleData.amount : 0;
        let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
        return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      } else if (a.saleData.soid === 2) {
        let r = a.saleData ? a.saleData.reserve : 0;
        let i = a.saleData ? a.saleData.increment : 0;
        let c = a.saleData ? a.saleData.fiatCurrency : "EUR";
        let aid = -1;
        if (a.saleData && a.saleData.auctionId) {
          aid = a.saleData.auctionId;
        }
        return `/my-artwork/register-for-auction/${id}/${aid}/${r}/${i}/${c}`;
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
