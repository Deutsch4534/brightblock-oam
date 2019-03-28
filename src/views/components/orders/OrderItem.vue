<template>
<div class="row mb-5" v-if="!loading">
  <div class="col-12">
    <div class="row order-header">
      <div class="col-md-9 col-sm-12">
        <h2 style="text-transform: capitalize;">{{artwork.title}}</h2>
      </div>
      <div class="col-md-3">
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 col-sm-4">
        <img class="img-fluid" :src="artwork.image" :alt="artwork.title">
      </div>
      <div class="col-md-6 col-sm-8">
        <order-details :invoiceClaim="invoice" v-if="showOrderDetails"/>
      </div>
      <div class="col-md-3 col-sm-6">
        <payment-details v-if="showPaymentDetails" :bitcoinUri="bitcoinUri" :invoiceClaim="invoice" @paymentSent="paymentSent"/>
        <confirmation-details v-if="showConfirmationDetails" :debugMode="debugMode" :invoiceClaim="invoice" :registerTx="artwork.bitcoinTx" @paySeller="paySeller"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mdbBtn, mdbContainer } from "mdbvue";
import invoiceService from "@/services/invoiceService";
import artworkSearchService from "@/services/artworkSearchService";
import myArtworksService from "@/services/myArtworksService";
import PaymentDetails from "./PaymentDetails";
import ConfirmationDetails from "./ConfirmationDetails";
import OrderDetails from "./OrderDetails";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OrderItem",
  components: {
    mdbBtn, mdbContainer,
    OrderDetails,
    ConfirmationDetails,
    PaymentDetails
  },
  props: {
    orderId: null,
    artworkId: null,
    debugMode: false
  },
  data() {
    return {
      loading: true,
      showPaymentDetails: false,
      showConfirmationDetails: false,
      showOrderDetails: true,
      bitcoinUri: null,
      artwork: null,
      invoice: null
    };
  },
  mounted() {
    let $self = this;
    this.$store.dispatch("invoiceStore/fetchInvoice", this.orderId).then(invoice => {
      if (invoice) {
        this.invoice = invoice;
        artworkSearchService.newQuery({field: "id", query: invoice.artworkId}, function(artwork) {
          $self.artwork = artwork;
          if (invoice.state === "unpaid") {
            $self.bitcoinUri = invoiceService.getBitcoinUri(invoice);
            $self.showPaymentDetails = true;
            $self.watchForPayment();
          } else if (invoice.state === "confirming") {
            $self.showConfirmationDetails = true;
            $self.watchForConfirmations();
          } else {
            $self.showConfirmationDetails = true;
            $self.checkPayment();
            $self.watchForSettlement();
            if (invoice.state === "settling" || invoice.state === "settled") {
              $self.checkSettlement();
            }
          }
          $self.loading = false;
        });
      } else {
        console.log("Order id but no order?");
      }
    })
  },
  methods: {
    buyNow() {
      this.showPaymentDetails = true;
      this.showConfirmationDetails = false;
    },
    paymentSent() {
      this.showConfirmationDetails = true;
      this.showPaymentDetails = false;
    },
    checkPayment() {
      this.$store.dispatch("invoiceStore/checkPayment", this.orderId);
    },
    checkSettlement() {
      this.$store.dispatch("invoiceStore/checkSettlement", this.orderId);
    },
    watchChainForPayment() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      let $self = this;
      invoiceService.watchForPayment(invoice, function(invoice) {
        if (invoice && invoice.buyerTransaction) {
          $self.showPaymentDetails = false;
          $self.showConfirmationDetails = true;
        }
      });
    },
    watchForPayment() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      let $self = this;
      let wfpInt = setInterval(function() {
        invoiceService.watchForPaymentInternal(invoice, function(newInvoice) {
          if (newInvoice && newInvoice.buyerTransaction) {
            $self.$store.commit("invoiceStore/addInvoice", newInvoice);
            clearInterval(wfpInt);
            $self.showPaymentDetails = false;
            $self.showConfirmationDetails = true;
            $self.watchForConfirmations();
          }
        });
      }, 5000);
    },
    watchForConfirmations() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      let $self = this;
      let wfconfsInt = setInterval(function() {
        $self.$store.dispatch("invoiceStore/checkPayment", $self.orderId).then((invoice) => {
          if (invoice.buyerTransaction.confirmations > 7) {
            clearInterval(wfconfsInt);
          }
        });
      }, 60000);
    },
    watchForSettlement() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      let $self = this;
      let wfsetInt = setInterval(function() {
        $self.$store.dispatch("invoiceStore/checkSettlement", $self.orderId).then((invoice) => {
          if (invoice.sellerTransaction.confirmations > 7) {
            clearInterval(wfsetInt);
          }
        });
      }, 60000);
    },
    paySeller() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      if (!invoice.sellerTransaction) {
        this.$store.dispatch("invoiceStore/paySeller", invoice).then((invoice) => {
          if (invoice) {
            this.$store.dispatch("myArtworksStore/fetchMyArtwork", invoice.artworkId).then((artwork) => {
              artwork.owner = invoice.seller.blockstackId;
              artwork.buyer = null;
              artwork.status = this.$store.state.constants.statuses.artwork.PURCHASE_COMPLETE;
              myArtworksService.addSaleHistoryPaySellerData(artwork, invoice.buyerTransaction.txid, invoice.sellerTransaction.txid);
              this.$store.dispatch("myArtworksStore/updateArtwork", artwork);
            });
          }
        });
      }
    }
  },
  computed: {}
};
</script>
<style scoped>
.order-header {
  text-transform: capitalise;
  font-weight: bold;
  font-size: 2.0em;
  border-bottom: 1pt solid #ccc;
  padding: 5px;
  margin-bottom: 5px;
}
.media-image {
  width: 20%;
}
.subtitle,
.card-body p {
  color: #000!important;
}
</style>
