<template>
<mdb-container id="DonateSection">
  <section class="my-5 p-5 border border-dark col-lg-10 mx-auto">
    <h2 class="large-title mt-0 mb-5">{{title}}</h2>
    <mdb-row>
      <mdb-col sm="6">
        <p class="w-responsive">{{description}}</p>
        <span class="serif subtitle">{{btcAddress}}</span>
        <div class="md-xsmall-size-100">
          <p class="mb-0">Target on {{chain}} chain: {{target}}</p>
          <p class="mb-0">Currently: {{balance}}</p>
        </div>
      </mdb-col>
      <mdb-col sm="6">
        <form class="contact-form text-right">
          <canvas id="qrcode" width="500px"></canvas>
        </form>
      </mdb-col>
    </mdb-row>
  </section>
</mdb-container>
</template>

<script>
import QRCode from "qrcode";
import { mdbContainer, mdbRow, mdbCol, mdbIcon, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Donate",
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon,
    mdbBtn
  },
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
<style scoped>
  .serif {
    font-family: 'Noto Serif Disp ExtCond';
  }
  .subtitle {
    text-decoration: underline;
    font-size: 2rem;
  }
</style>
