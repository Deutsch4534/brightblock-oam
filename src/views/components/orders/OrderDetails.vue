<template>
<div class="container mb-5">
<mdb-tbl responsive>
  <mdb-tbl-head color="stylish-color" textWhite>
    <tr>
      <th @click="showDetails = !showDetails"><a><mdb-icon far icon="caret-square-down" /></a></th>
      <th><span v-if="showDetails">Party</span></th>
      <th><span v-if="showDetails">Notes</span></th>
      <th><span v-if="showDetails">Rate</span></th>
      <th>{{invoiceClaim.invoiceAmounts.fiatCurrency}}</th>
      <th>
        <mdb-popover trigger="click" :options="{placement: 'top'}">
          <div class="popover">
            <div class="popover-header">
              BTC
            </div>
            <div class="popover-body">
              Amounts in Bitcoin (BTC) are calculated in real time from the amount
              listed in the fiat currency chosen by the seller.
            </div>
          </div>
          <a @click.prevent="" slot="reference">
            BTC <mdb-icon far icon="question-circle" />
          </a>
        </mdb-popover>
      </th>
    </tr>
  </mdb-tbl-head>
  <mdb-tbl-body>
    <tr v-for="(row, index) in invoiceRows" :key="index" :class="row.rowClass" v-if="showDetails">
      <th>{{row.counter}}</th>
      <td>{{row.party}}</td>
      <td>{{row.notes}}</td>
      <td>{{row.rate}}</td>
      <td>{{row.fiatAmount}}</td>
      <td>{{row.bitcoinAmount}}</td>
    </tr>
    <tr class="white">
      <th></th>
      <td></td>
      <td></td>
      <td></td>
      <td>{{invoicePayRow.fiatAmount}}</td>
      <td>{{invoicePayRow.bitcoinAmount}}</td>
    </tr>
  </mdb-tbl-body>
</mdb-tbl>
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
    }
  },
  data() {
    return {
      bitcoinState: {},
      balance: null,
      invoicePayRow: {},
      invoiceRows: [],
      showInstructions: false,
      showPaymentDetails: false,
      order: null,
      showDetails: true
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
