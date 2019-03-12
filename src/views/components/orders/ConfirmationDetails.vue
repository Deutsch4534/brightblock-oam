<template>
<div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <p><a href="#" @click.prevent="showBlockchainInfo = !showBlockchainInfo">Open full details</a></p>
        <div class="mb-4" v-if="showBlockchainInfo">
          <div class="row">
            <div class="col-3">Network</div>
            <div class="col-6">{{bitcoinState.chain}}</div>
          </div>
          <div class="row">
            <div class="col-3">Transactions</div>
            <div class="col-6"><a :href="registerBlockchainUrl()" target="_blank">Provenance</a></div>
          </div>
          <div class="row" v-if="invoiceClaim.buyerTransaction">
            <div class="col-3"></div>
            <div class="col-6"><a :href="buyerBlockchainUrl()" target="_blank">Payment</a></div>
          </div>
          <div class="row" v-if="invoiceClaim.sellerTransaction">
            <div class="col-3"></div>
            <div class="col-6"><a :href="sellerBlockchainUrl()" target="_blank">Settlement</a></div>
          </div>
        </div>
        <div>Order Number: {{invoiceClaim.invoiceId}}</div>
        <div>Order created: {{timeReceived}}</div>
        <div v-if="unpaid">Payment not yet received</div>
        <div v-else-if="confirming">Payment received (confirming - {{buyerConfirmations}} / 6)</div>
        <div v-else-if="confirmed">
          Payment has been confirmed (with {{buyerConfirmations}} confirmations)
          <div v-if="digiArt">{{paySeller()}}</div>
          <div v-else><mdb-btn @click="paySeller" rounded color="white" size="sm" class="mx-0 waves-light">pay seller</mdb-btn></div>
        </div>
        <div v-else-if="settling">Owner / artist are being paid ({{sellerConfirmations}} / 6 confirmations)</div>
        <div v-else-if="settled">Owner / artist have been paid (with {{sellerConfirmations}} confirmations)</div>
        <div v-else>
          <div>status in between</div>
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
    },
    registerTx: null
  },
  data() {
    return {
      bitcoinState: {},
      showBlockchainInfo: false,
      showInstructions: false,
      showPaymentDetails: false,
      order: null,
    };
  },
  mounted() {
    this.bitcoinState = this.$store.getters["bitcoinStore/getBitcoinState"];
  },
  computed: {
    buyerConfirmations() {
      return this.invoiceClaim.buyerTransaction.confirmations;
    },
    sellerConfirmations() {
      try {
        return this.invoiceClaim.sellerTransaction.confirmations;
      } catch (err) {
        return 0;
      }
    },
    settled() {
      return this.invoiceClaim.sellerTransaction && this.invoiceClaim.sellerTransaction.confirmations > 5;
    },
    settling() {
      return this.invoiceClaim.sellerTransaction && this.invoiceClaim.sellerTransaction.confirmations < 6;
    },
    confirming() {
      return !this.invoiceClaim.sellerTransaction && this.invoiceClaim.buyerTransaction.confirmations < 6;
    },
    confirmed() {
      return !this.invoiceClaim.sellerTransaction && this.invoiceClaim.buyerTransaction.confirmations > 5;
    },
    unpaid() {
      return !this.invoiceClaim.sellerTransaction && !this.invoiceClaim.buyerTransaction;
    },
    confirmations() {
      return this.invoiceClaim.buyerTransaction.confirmations;
    },
    digiArt() {
      return this.invoiceClaim.itemType === "digiart";
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
    registerBlockchainUrl() {
      if (this.bitcoinState.chain === "test") {
        return `https://testnet.blockexplorer.com/tx/${this.registerTx}`;
      }
      return `https://www.blockchain.com/btc/tx/${this.registerTx}`;
    },
    buyerBlockchainUrl() {
      let txid = this.invoiceClaim.buyerTransaction.txid;
      if (this.bitcoinState.chain === "test") {
        return `https://testnet.blockexplorer.com/tx/${txid}`;
      }
      return `https://www.blockchain.com/btc/tx/${txid}`;
    },
    sellerBlockchainUrl() {
      try {
        let txid = this.invoiceClaim.sellerTransaction.txid;
        if (this.bitcoinState.chain === "test") {
          return `https://testnet.blockexplorer.com/tx/${txid}`;
        }
        return `https://www.blockchain.com/btc/tx/${txid}`;
      } catch (err) {
        return null;
      }
    },
    sendBuyNow() {
      this.$emit("buyNow");
    },
    paySeller() {
      if (!this.invoiceClaim.sellerTransaction) {
        this.$emit("paySeller");
      }
      return "payment sent..";
    }
  }
};
</script>
