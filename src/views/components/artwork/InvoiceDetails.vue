<template>
<div class="container">
  <mdb-card-body>
    <mdb-card-title>Invoice Details
    <span class="text-danger">UNDER CONSTRUCTION - <a @click.prevent="showInstructions = !showInstructions">show more</a></span>
    </mdb-card-title>
    <mdb-card-text v-if="showInstructions">
    <p>Some links which may be helpful here..
      <ul>
        <li><a href="https://coinfaucet.eu/en/btc-testnet/">Testnet Faucet <mdb-icon icon="external-link-alt" /></a></li>
        <li>Run electrum on testnet on mac: $ /Applications/Electrum.app/Contents/MacOS/Electrum --testnet</li>
        <li>Run bitcoin-qt on testnet on mac: /Applications/Bitcoin-Qt.app/Contents/MacOS/Bitcoin-Qt -testnet -datadir=~/Library/Application\ Support/Bitcoin/testnet</li>
        <li><a href="https://electrum.readthedocs.io/en/latest/faq.html#can-i-do-bulk-payments-with-electrum" target="_blank">info on electrum on testnet <mdb-icon icon="external-link-alt" /></a></li>
        <li><a href="https://bitcoin.stackexchange.com/questions/37902/running-another-instance-of-bitcoin-qt-dedicated-to-testnet-regtest" target="_blank">run bitcoin-qt on testnet <mdb-icon icon="external-link-alt" /></a></li>
      </ul>
    </p>
    </mdb-card-text>
    <mdb-card-text>
      <div class="row mb-4">
        <div class="col-md-12">{{bitcoinState.chain}} chain, balance: {{balance}}</div>
      </div>
      <div class="row mb-4">
        <mdb-tbl responsive>
          <mdb-tbl-head color="primary-color" textWhite>
            <tr>
              <th>#</th>
              <th>Party</th>
              <th>Notes</th>
              <th>Rate</th>
              <th>{{artwork.saleData.fiatCurrency}}</th>
              <th>
                <mdb-popover trigger="click" :options="{placement: 'top'}">
                  <div class="popover">
                    <div class="popover-header">
                      BTC
                    </div>
                    <div class="popover-body">
                      Amounts in Bitcoin (BTC) are calculated in real time from the amount the
                      artwork is listed in the fiat currency chosen by the seller.
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
            <tr scope="row" v-for="(row, index) in invoiceRows" :key="index" :class="row.rowClass">
              <th scope="row">{{row.counter}}</th>
              <td>{{row.party}}</td>
              <td>{{row.notes}}</td>
              <td>{{row.rate}}</td>
              <td>{{row.fiatAmount}}</td>
              <td>{{row.bitcoinAmount}}</td>
            </tr>
          </mdb-tbl-body>
        </mdb-tbl>
      </div>
    </mdb-card-text>
  </mdb-card-body>
  <div v-if="!isPaid">
    <div class="row" v-if="!showPaymentDetails">
      <div class="col-12 mb-5">
        <mdb-btn @click="openPaymentDetails()" type="submit" size="md" class="btn-main btn-block">Continue to Payment</mdb-btn>
      </div>
    </div>
    <div class="w-100"></div>
    <payment-details v-if="showPaymentDetails" :artwork="artwork" :bitcoinUri="bitcoinUri" @registerPayment="lookupTransaction"/>
  </div>
  <div v-else>
    <div class="row">
      <div class="col-12 mb-5">
        <mdb-btn type="submit" size="md" class="btn-main btn-block">Invoice Paid - Status = {{invoiceClaim.state}}</mdb-btn>
      </div>
    </div>
    <div class="row">
      <div class="col-12 mb-5">
        {{invoiceClaim.transaction.txid}}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";
import { mdbTbl, mdbTblHead, mdbTblBody } from 'mdbvue';
import bitcoinService from "@/services/bitcoinService";
import invoiceService from "@/services/invoiceService";
import PaymentDetails from "./PaymentDetails";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "InvoiceDetails",
  components: {
    PaymentDetails,
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
    artwork: {},
    seller: null,
    buyer: null
  },
  data() {
    return {
      bitcoinState: {},
      balance: null,
      invoiceRows: [],
      showInstructions: false,
      showPaymentDetails: false,
      isPaid: false,
      order: null,
      bitcoinUri: null
    };
  },
  mounted() {
    this.balance = this.$store.getters["bitcoinStore/getBalance"];
    this.bitcoinState = this.$store.getters["bitcoinStore/getBitcoinState"];
    this.invoiceClaim = this.$store.getters["invoiceStore/getInvoiceByLabel"](this.artwork.id + " :: " + this.artwork.title);
    if (!this.invoiceClaim) {
      let invoiceRates = this.$store.state.constants.invoiceRates;
      let invoiceAmounts = invoiceService.getInvoiceAmounts(invoiceRates, this.artwork.saleData, this.artwork.gallery, this.artwork.artist !== this.artwork.owner);
      this.invoiceClaim = invoiceService.createInvoiceClaim(this.artwork, invoiceRates, invoiceAmounts);
      invoiceService.saveInvoiceClaim(this.invoiceClaim);
      this.showPaymentDetails = true;
    } else if (this.invoiceClaim.transaction && this.invoiceClaim.transaction.txid) {
      this.isPaid = true;
      this.$router.push("/reconcile/" + this.artwork.id);
    } else {
      this.lookupTransaction();
    }
    this.invoiceRows = invoiceService.populateInvoiceRows(this.artwork, this.invoiceClaim.invoiceRates, this.invoiceClaim.invoiceAmounts);
    this.bitcoinUri = invoiceService.getBitcoinUri(this.invoiceClaim);
  },
  computed: {
  },
  methods: {
    openPaymentDetails() {
      this.showPaymentDetails = true;
    },
    lookupTransaction() {
      try {
        this.showPaymentDetails = false;
        let $self = this;
        bitcoinService.lookupTransaction({timestamp: this.invoiceClaim.timestamp, amount: this.invoiceClaim.invoiceAmounts.totalBitcoin}, function(result) {
          if (result) {
            $self.invoiceClaim.transaction = result;
            $self.isPaid = true;
            $self.$router.push("/reconcile/" + $self.artwork.id);
          } else {
            $self.showPaymentDetails = true;
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
