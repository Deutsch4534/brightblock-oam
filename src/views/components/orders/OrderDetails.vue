<template>
<div class="container mb-5">
  <div class="row py-3">
    <div class="col-6"><b>{{seller}}</b></div>
    <div class="col-2"></div>
    <div class="col-2"><b>{{invoiceClaim.invoiceAmounts.fiatCurrency}}</b></div>
    <div class="col-2"><b>BTC</b></div>
  </div>
  <div class="row" v-for="(row, index) in invoiceRows" :key="index" v-if="showDetails">
    <div class="col-3">{{row.party}}</div>
    <div class="col-3"></div>
    <div class="col-2">{{row.rate}}</div>
    <div class="col-2">{{row.fiatAmount}}</div>
    <div class="col-2">{{row.bitcoinAmount}}</div>
  </div>
  <div class="row">
    <div class="col-8"><a class="teal-text darken-3" @click.prevent="showDetails = !showDetails"><span v-if="!showDetails">show more details</span><span v-else>show less</span></a></div>
    <div class="col-2">{{invoicePayRow.fiatAmount}}</div>
    <div class="col-2">{{invoicePayRow.bitcoinAmount}}</div>
  </div>
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
  name: "OrderDetails",
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
    },
  },
  data() {
    return {
      bitcoinState: {},
      balance: null,
      invoicePayRow: {},
      invoiceRows: [],
      showInstructions: false,
      showPaymentDetails: false,
      showDetails: false,
      order: null,
    };
  },
  mounted() {
    this.balance = this.$store.getters["bitcoinStore/getBalance"];
    this.bitcoinState = this.$store.getters["bitcoinStore/getBitcoinState"];
    if (this.invoiceClaim && this.invoiceClaim.seller) {
      this.invoiceRows = invoiceService.populateInvoiceRows(this.invoiceClaim);
      this.invoicePayRow = invoiceService.populatePayRow(this.invoiceClaim);
    }
  },
  computed: {
    seller() {
      if (this.invoiceClaim && this.invoiceClaim.seller) {
        return this.invoiceClaim.seller.blockstackId;
      }
    },
    paymentReceived() {
      return this.invoiceClaim.buyerTransaction;
    }
  },
  methods: {
    sendBuyNow() {
      this.$emit("buyNow");
    },
  }
};
</script>
