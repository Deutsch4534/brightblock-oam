<template>
<div class="container">
  <mdb-card-body>
    <div class="row">
      <div class="col-12">
        <p>Order Number: {{invoiceClaim.invoiceId}}</p>
        <p>Payment received: {{timeReceived}}</p>
        <p v-if="paymentDetected">Current state: {{invoiceStatus()}} by {{confirmations}} blocks</p>
      </div>
    </div>
    <div class=" text-center">
      <div class="col-12">
        <p><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">pay seller</mdb-btn></p>
      </div>
    </div>
    <div class="row" v-if="sendUpstreamPayment">
      <div class="col-12">
        <p>Transaction confirmed - paying seller {{paySeller()}}</p>
      </div>
    </div>
  </mdb-card-body>
</div>
</template>

<script>
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbTbl, mdbTblHead, mdbTblBody } from 'mdbvue';
import bitcoinService from "@/services/bitcoinService";
import invoiceService from "@/services/invoiceService";
import moment from "moment";
import myArtworksService from "@/services/myArtworksService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ConfirmationDetails",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbTbl,
    mdbTblHead,
    mdbTblBody
  },
  props: {
    invoiceClaim: {
      invoiceAmounts: {},
      invoiceRates: {}
    }
  },
  data() {
    return {
      bitcoinState: {},
      balance: null,
      invoiceRows: [],
      showInstructions: false,
      showPaymentDetails: false,
      order: null,
    };
  },
  mounted() {
    this.balance = this.$store.getters["bitcoinStore/getBalance"];
    this.bitcoinState = this.$store.getters["bitcoinStore/getBitcoinState"];
    this.invoiceRows = invoiceService.populateInvoiceRows(this.invoiceClaim);
  },
  computed: {
    paymentDetected() {
      return this.invoiceClaim.buyerTransaction;
    },
    confirmations() {
      return this.invoiceClaim.buyerTransaction.confirmations;
    },
    paymentConfirmed() {
      return this.invoiceClaim.state === "confirmed" && this.invoiceClaim.itemType !== "digiart";
    },
    sendUpstreamPayment() {
      return this.invoiceClaim.state === "confirmed" && this.invoiceClaim.itemType === "digiart";
    },
    timeReceived() {
      let date = moment(this.invoiceClaim.timestamp).format(moment.HTML5_FMT.DATE);
      let time = moment(this.invoiceClaim.timestamp).format(moment.HTML5_FMT.TIME);
      return date + " " + time
    }
  },
  methods: {
    invoiceStatus() {
      if (this.invoiceClaim.state === "unpaid") {
        return "Processing - please wait...";
      }
      return this.invoiceClaim.state;
    },
    sendBuyNow() {
      this.$emit("buyNow");
    },
    paySeller() {
      this.$emit("paySeller");
    }
  }
};
</script>
