<template>
<div class="container">
  <mdb-card-body  v-if="invoiceClaim.buyerTransaction">
    <mdb-card-text>
      <div class="row text-center">Payment has been received with thanks - you can check the status of the order in the confirmation tab.</div>
    </mdb-card-text>
  </mdb-card-body>
  <mdb-card-body v-else>
    <mdb-card-title>
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">
            Ra.Pay
          </div>
          <div class="popover-body">
          Payment is held in escrow until the transaction is complete.
          </div>
          <div class="popover-body">
          This allows us to automate payment of refunds in cases of dispute and also to
          seemlessly transfer provenance from seller to buyer.
          </div>
        </div>
        <a @click.prevent="" slot="reference">
          Payment Methods <mdb-icon far icon="question-circle" />
        </a>
      </mdb-popover>
    </mdb-card-title>
    <mdb-card-text>
      Please pay using your bitcoin wallet and then <mdb-btn rounded color="white" size="sm" class="mr-1 ml-0 waves-light" @click="sentPayment">click here.</mdb-btn>
    </mdb-card-text>
    <mdb-card-text>
    <div class="w-100"></div>
      <div class="row text-center">
        <div class="col-md-12">
          <div class="row text-center">
            <div class="col-md-12">
              <canvas id="qrcode1" max-width="150px"></canvas>
            </div>
            <div class="col-md-12"><a :href="bitcoinUri">open bitcoin wallet</a></div>
          </div>
        </div>
      </div>
    </mdb-card-text>
  </mdb-card-body>
</div>
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
    bitcoinUri: null,
    invoiceClaim: null
  },
  data() {
    return {
    };
  },
  watch: {
    // whenever question changes, this function will run
    invoiceClaim: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  mounted() {
    if (this.bitcoinUri) {
      this.addQrCode("qrcode1", this.bitcoinUri);
    }
  },
  computed: {
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
    sentPayment() {
      this.$emit("paymentSent");
    }
  }
};
</script>
