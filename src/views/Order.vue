<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <mdb-container class="mt-5">
    <mdb-row>
      <mdb-col col="12" md="5">
        <mdb-view hover>
          <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
      </mdb-col>
      <mdb-col col="12" md="7" class="pl-md-5">
        <h2>{{artwork.title}}</h2>
        <p>by <router-link :to="artistUrl()"><u>{{artist.name}}</u></router-link>, {{created}}</p>
        <payment-details v-if="showPaymentDetails" :bitcoinUri="bitcoinUri" :invoiceClaim="invoice" @paymentSent="paymentSent"/>
        <confirmation-details v-if="showConfirmationDetails" :invoiceClaim="invoice" :registerTx="artwork.bitcoinTx" @paySeller="paySeller"/>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</mdb-container>
</template>

<script>
import artworkSearchService from "@/services/artworkSearchService";
import { mdbContainer, mdbRow, mdbCol, mdbIcon, mdbMask, mdbView, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from 'mdbvue';
import moment from "moment";
import invoiceService from "@/services/invoiceService";
import myArtworksService from "@/services/myArtworksService";
import PaymentDetails from "./components/orders/PaymentDetails";
import ConfirmationDetails from "./components/orders/ConfirmationDetails";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Order",
  bodyClass: "index-page",
  components: {
    PaymentDetails,
    ConfirmationDetails,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon,
    mdbMask,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbView
  },
  data() {
    return {
      orderId: null,
      showPaymentDetails: false,
      showConfirmationDetails: false,
      bitcoinUri: null
    };
  },
  mounted() {
    this.orderId = Number(this.$route.params.orderId);
    let $self = this;
    this.$store.dispatch("invoiceStore/fetchInvoice", this.orderId).then(invoice => {
      if (invoice) {
        artworkSearchService.newQuery({field: "id", query: invoice.artworkId});
        if (invoice.state === "unpaid") {
          $self.bitcoinUri = invoiceService.getBitcoinUri(invoice);
          $self.showPaymentDetails = true;
          $self.watchChainForPayment();
        } else if (invoice.state === "confirming") {
          $self.showConfirmationDetails = true;
          $self.watchChainForPayment();
        } else {
          $self.showConfirmationDetails = true;
          $self.checkPayment();
          if (invoice.state === "settling" || invoice.state === "settled") {
            $self.checkSettlement();
          }
        }
      } else {
        console.log("Order id but no order?");
      }
    })
  },
  computed: {
    artist() {
      let artwork = this.artwork;
      if (artwork.artist) {
        return this.$store.getters["userProfilesStore/getProfile"](artwork.artist);
      }
      return {name: ""};
    },
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("DD/MMM/YYYY");
      }
      return moment(this.artwork.id).format("DD/MMM/YYYY");
    },
    artwork() {
      let defArtwork = {
        image: require("@/assets/img/missing/artwork-missing.jpg"),
        saleData: {}
      };
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      if (!invoice) {
        return defArtwork;
      }
      let artwork = this.$store.getters["artworkSearchStore/getArtwork"](invoice.artworkId);
      if (!artwork.id) {
        return defArtwork;
      }
      return artwork;
    },
    invoice() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      if (!invoice) {
        return {
          invoiceAmounts: {},
          invoiceRates: {},
        };
      }
      return invoice;
    }
  },
  methods: {
    artistUrl () {
      let artwork = this.artwork;
      return '/artists/' + artwork.artist;
    },
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
  }
};
</script>
<style>
.view img {
  width: 100%;
}
.jumbotron {
  height: 130vh;
}
</style>
