<template>
<div class="section section-contacts" id="donateSection">
  <div class="container">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto">
        <h2 class="text-center title">{{title}}</h2>
        <h4 class="text-center description">{{description}}</h4>
        <form class="contact-form">
            <div class="md-layout text-center">
              <div class="md-layout-item md-size-100 md-xsmall-size-100">
                <canvas id="qrcode" width="500px"></canvas>
              </div>
              <div class="md-layout-item md-size-100 md-xsmall-size-100">
                <span>{{btcAddress}}</span>
              </div>
              <div class="md-layout-item md-size-100 md-xsmall-size-100">
                <span>Target on chain: {{chain}}: {{target}}, Currently: {{balance}}</span>
              </div>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import QRCode from "qrcode";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Donate",
  data() {
    return {
      title: "",
      description: "",
      btcAddress: null
    };
  },
  mounted() {
    this.getContent();
    this.$store.dispatch("bitcoinStore/fetchBalance");
    this.$store.dispatch("bitcoinStore/fetchClientState");
  },
  computed: {
    chain() {
      let s = this.$store.getters["bitcoinStore/getClientState"];
      if (s) {
        return s.chain;
      }
    },
    balance() {
      return this.$store.getters["bitcoinStore/getBalance"];
    },
    target() {
      return this.$store.getters["bitcoinStore/getTarget"];
    }
  },
  methods: {
    getContent() {
      let $self = this;
      let $qrCode = document.getElementById("qrcode");
      this.$prismic.client.getSingle("donate").then(document => {
        this.title = document.data.title[0].text;
        this.description = document.data.description[0].text;
        this.btcAddress = document.data.btc_address[0].text;
        QRCode.toCanvas(
          $qrCode,
          $self.btcAddress,
          { errorCorrectionLevel: "H" },
          function(error) {
            if (error) console.error(error);
            console.log("success!");
          }
        );
      });
    }
  }
};
</script>
