<template>
<div class="container mt-4">
  <mdb-card-body v-if="!showPaymentDetails">
    <mdb-card-title>
    Invoice Details - <span class="text-danger">{{bitcoinState.chain}} chain</span>
    <!--
    <span class="text-danger">UNDER CONSTRUCTION - <a @click.prevent="showInstructions = !showInstructions">show more</a></span>
    -->
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
        <div class="col-md-12"></div>
      </div>
      <div class="row mb-4">
        <mdb-tbl responsive>
          <mdb-tbl-head color="primary-color" textWhite>
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
          </mdb-tbl-body>
        </mdb-tbl>
      </div>
    </mdb-card-text>
  </mdb-card-body>
  <div v-if="!paymentReceived">
    <div class="row">
      <div class="col-12 mb-5" v-if="!showPaymentDetails">
        <mdb-btn @click="openPaymentDetails()" size="md" class="btn-main btn-block">Accept and Pay</mdb-btn>
      </div>
    </div>
    <div class="w-100"></div>
    <payment-details v-if="showPaymentDetails" :bitcoinUri="bitcoinUri" :invoiceClaim="invoiceClaim" @registerPayment="lookupTransaction"/>
  </div>
  <div v-else>
    <div class="row">
      <div class="col-12 mb-5">
      <mdb-tbl responsive>
        <mdb-tbl-head color="primary-color" textWhite>
          <tr>
            <th>#</th>
            <th>Payment received</th>
            <th>
              <mdb-popover trigger="click" :options="{placement: 'top'}">
                <div class="popover">
                  <div class="popover-header">
                    Block Confirmations
                  </div>
                  <div class="popover-body">
                    The number of bitcoin block confirmations for your payment - 6 or more is considered paid.
                  </div>
                </div>
                <a @click.prevent="" slot="reference">
                  Confirmations <mdb-icon far icon="question-circle" />
                </a>
              </mdb-popover>
            </th>
          </tr>
        </mdb-tbl-head>
        <mdb-tbl-body>
          <tr class="table-info">
            <th></th>
            <td>{{timeReceived}}</td>
            <td>{{confirmations}}</td>
          </tr>
          <tr class="table-info" v-if="paymentConfirmed">
            <th>

            </th>
            <td></td>
            <td @click=""><mdb-btn rounded color="white" size="sm" class="mx-0 waves-light">Confirm Receipt</mdb-btn></td>
          </tr>
        </mdb-tbl-body>
      </mdb-tbl>
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
import moment from "moment";

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
      bitcoinUri: null
    };
  },
  mounted() {
    this.balance = this.$store.getters["bitcoinStore/getBalance"];
    this.bitcoinState = this.$store.getters["bitcoinStore/getBitcoinState"];
    this.invoiceRows = invoiceService.populateInvoiceRows(this.invoiceClaim);
    this.bitcoinUri = invoiceService.getBitcoinUri(this.invoiceClaim);
  },
  computed: {
    confirmations() {
      if (!this.invoiceClaim || !this.invoiceClaim.transaction) {
        return "none";
      }
      return this.invoiceClaim.transaction.confirmations;
    },
    paymentReceived() {
      return this.invoiceClaim.transaction;
    },
    paymentConfirmed() {
      return this.invoiceClaim.transaction.confirmations > 5;
    },
    timeReceived(date) {
      return moment(this.invoiceClaim.timestamp).format();
    }
  },
  methods: {
    openPaymentDetails() {
      let $self = this;
      invoiceService.saveInvoiceClaim($self.invoiceClaim, function(res) {
        invoiceService.watchForPayment($self.invoiceClaim);
        $self.showPaymentDetails = true;
      });
    },
    confirmGoodsReceived() {
      let $self = this;
      bitcoinService.payUpstreamTransaction({invoice: invoice}, function(result) {
        console.log(result);
        saleHistory.provenanceTxid = result;
        artwork.saleHistory.push(saleHistory);
      });
    },
    lookupTransaction() {
      try {
        this.showPaymentDetails = false;
        let $self = this;
        bitcoinService.lookupTransaction({timestamp: this.invoiceClaim.timestamp, amount: this.invoiceClaim.invoiceAmounts.totalBitcoin}, function(result) {
          if (result) {
            $self.invoiceClaim.transaction = result;
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
