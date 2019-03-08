<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <mdb-row>
    <mdb-col col="12" lg="10">
      <mdb-row class="py-5">
        <mdb-col col="12" md="4">
          <mdb-view hover>
            <img class="inplay-image img-fluid mb-4" width="100%" :src="artwork.image" :alt="artwork.title">
            <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
            <h1 class="h5-responsive">{{artwork.title}}</h1>
            <p class="h5-responsive">by <a><u>{{artist.name}}</u></a>, {{created}}</p>
            <p class="h5-responsive" v-if="artwork.itemType === 'digiart'">Digital Artwork</p>
            <p class="h5-responsive" v-else>Physical Artwork</p>
          </mdb-view>
        </mdb-col>
        <mdb-col col="12" md="8">
          <mdb-row>
            <mdb-col col="12" lg="10">
              1. <a :class="breadClass('review')" @click="goto('review')">Order</a> --> 2. <a :class="breadClass('pay')" @click="goto('pay')">Payment</a> --> 3. <a :class="breadClass('confirm')" @click="goto('confirm')">Confirm</a>
            </mdb-col>
          </mdb-row>
          <order-details :invoiceClaim="invoice" v-if="showOrderDetails" @buyNow="buyNow"/>
          <payment-details v-if="showPaymentDetails" :bitcoinUri="bitcoinUri" :invoiceClaim="invoice" @paymentSent="paymentSent"/>
          <confirmation-details v-if="showConfirmationDetails" :invoiceClaim="invoice" :registerTx="artwork.bitcoinTx" @paySeller="paySeller"/>
        </mdb-col>
      </mdb-row>
    </mdb-col>
  </mdb-row>
</mdb-container>
</template>

<script>
import OrderDetails from "./components/orders/OrderDetails";
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
    OrderDetails,
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
      showOrderDetails: false,
      showPaymentDetails: false,
      showConfirmationDetails: false
    };
  },
  mounted() {
    this.orderId = Number(this.$route.params.orderId);
    let $self = this;
    this.$store.dispatch("invoiceStore/fetchInvoice", this.orderId).then(invoice => {
      let status = invoiceService.getInvoiceStatusFromState(invoice.state);
      artworkSearchService.newQuery({field: "id", query: invoice.artworkId}, function(artwork) {
        if (status === 1) {
          $self.showOrderDetails = true;
        } else {
          $self.showConfirmationDetails = true;
        }
      });
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
        image: require("@/assets/img/logo/logo-black-256x256.png"),
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
    bitcoinUri() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      let bitcoinUri = invoiceService.getBitcoinUri(invoice);
      return bitcoinUri;
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
    breadClass(id) {
      if (id === "review") {
        if (this.showOrderDetails) {
          return "text-danger";
        }
      } else if (id === "pay") {
        if (this.showPaymentDetails) {
          return "text-danger";
        }
      } else if (id === "confirm") {
        if (this.showConfirmationDetails) {
          return "text-danger";
        }
      }
      return "";
    },
    invoiceStatus() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      return invoiceService.getInvoiceStatusFromState(invoice.state);
    },
    buyNow() {
      this.showOrderDetails = false;
      this.showPaymentDetails = true;
      this.showConfirmationDetails = false;
    },
    goto(view) {
      this.showOrderDetails = false;
      this.showPaymentDetails = false;
      this.showConfirmationDetails = false;
      if (view === "review") {
        this.showOrderDetails = true;
      } else if (view === "pay") {
        this.showPaymentDetails = true;
      } else if (view === "confirm") {
        this.showConfirmationDetails = true;
      }
    },
    reopenPaymentInfo() {
      this.showConfirmationDetails = false;
      this.showOrderDetails = false;
      this.showPaymentDetails = true;
    },
    reopenOrderInfo() {
      this.showConfirmationDetails = false;
      this.showOrderDetails = true;
      this.showPaymentDetails = false;
    },
    paymentSent() {
      this.showConfirmationDetails = true;
      this.showOrderDetails = false;
      this.showPaymentDetails = false;
    },
    paySeller() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
      this.$store.dispatch("invoiceStore/paySeller", invoice).then((invoiceClaim) => {
        if (invoiceClaim) {
          artwork.owner = invoiceClaim.seller.blockstackId;
          artwork.buyer = null;
          myArtworksService.addSaleHistoryPaySellerData(artwork, invoiceClaim.buyerTransaction.txid, invoiceClaim.sellerTransaction.txid);
          this.$store.dispatch("myArtworksStore/updateArtwork", artwork);
        }
      });
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
