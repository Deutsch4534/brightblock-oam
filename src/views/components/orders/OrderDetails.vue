<template>
<div class="container">
  <mdb-card-body>
    <mdb-card-text>
      <div class="row mb-4">
        <div class="col-md-12"></div>
      </div>
      <div class="row mb-4">
        <mdb-tbl responsive>
          <mdb-tbl-head color="stylish-color" textWhite>
            <tr>
              <th>#</th>
              <th>Party</th>
              <th>Notes</th>
              <th>Rate</th>
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
            <tr v-for="(row, index) in invoiceRows" :key="index" :class="row.rowClass">
              <th>{{row.counter}}</th>
              <td>{{row.party}}</td>
              <td>{{row.notes}}</td>
              <td>{{row.rate}}</td>
              <td>{{row.fiatAmount}}</td>
              <td>{{row.bitcoinAmount}}</td>
            </tr>
            <tr class="grey">
              <th></th>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td v-if="!paymentReceived"><mdb-btn rounded color="white" size="md" class="mr-1 ml-0 waves-light" @click="sendBuyNow">Buy Now</mdb-btn></td>
              <td v-else>-</td>
            </tr>
          </mdb-tbl-body>
        </mdb-tbl>
      </div>
    </mdb-card-text>
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
      invoiceRows: [],
      showInstructions: false,
      showPaymentDetails: false,
      order: null,
    };
  },
  mounted() {
    this.balance = this.$store.getters["bitcoinStore/getBalance"];
    this.bitcoinState = this.$store.getters["bitcoinStore/getBitcoinState"];
    if (this.invoiceClaim && this.invoiceClaim.seller) {
      this.invoiceRows = invoiceService.populateInvoiceRows(this.invoiceClaim);
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
