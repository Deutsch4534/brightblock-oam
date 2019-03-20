<template>
  <section id="DonateSection" class="py-5">
    <mdb-row class="py-3 py-md-5 text-light">
      <mdb-col lg="10">
        <mdb-row>
          <mdb-col col="12">
            <h2 class="large-title mt-0">{{title}}</h2>
          </mdb-col>
          <mdb-col sm="6" md="8">
            <p class="h4-responsive mb-5">{{description}}</p>
            <p class="h3-responsive text-uppercase my-4">{{btcAddress}}:</p>
          </mdb-col>
          <mdb-col sm="6" md="4" class="d-flex">
            <form class="contact-form text-right d-flex w-100 align-items-end justify-content-end">
              <canvas id="qrcode" width="500px" class="p-2 img-fluid"></canvas>
            </form>
          </mdb-col>
        </mdb-row>
      </mdb-col>
    </mdb-row>
  </section>
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
      content: null,
      btcAddress: null,
      title: null,
      description: null,
    };
  },
  mounted() {
    this.$store.dispatch("bitcoinStore/fetchBalance");
    this.$store.dispatch("bitcoinStore/fetchBitcoinState");
    let content = this.$store.state.contentStore.content["index-page"];
    this.btcAddress = content["donate-btc-address"][0].text;
    this.title = content["donate-title"][0].text;
    this.description = content["donate-description"][0].text;
  },
  computed: {},
  methods: {
    getContent() {
      let $self = this;
      let $qrCode = document.getElementById("qrcode");
      QRCode.toCanvas(
        $qrCode,
        $self.btcAddress,
        { errorCorrectionLevel: "H" },
        function(error) {
          if (error) console.error(error);
          console.log("success!");
        }
      );
    }
  }
};
</script>
<style scoped>
  form > canvas#qrcode {
    height: 100%!important; width: 100%!important;
    border: 2px solid white;
  }
</style>
