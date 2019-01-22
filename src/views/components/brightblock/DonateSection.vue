<template>
<mdb-container id="DonateSection">
  <section class="text-center my-5 mx-5 px-5">
    <h2 class="h1-responsive font-weight-bold my-5">{{title}}</h2>
    <p class="lead grey-text w-responsive mx-auto mb-5">{{description}}</p>
    <mdb-row>
      <mdb-col md="8 mx-auto">
        <form class="contact-form">
            <div class="md-layout text-center">
              <div class="md-layout-item md-size-100 md-xsmall-size-100">
                <canvas id="qrcode" width="500px"></canvas>
              </div>
              <div class="md-layout-item md-size-100 md-xsmall-size-100">
                <span>{{btcAddress}}</span>
              </div>
              <div class="md-layout-item md-size-100 md-xsmall-size-100">
                <span>Target on {{chain}} chain: {{target}}, Currently: {{balance}}</span>
              </div>
            </div>
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
