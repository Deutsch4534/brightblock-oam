<template>
<div class="container">
  <mdb-row class="pt-3">
    <mdb-col col="12">
      <h2 class="h5-responsive"><mdb-icon title="Digital work" far icon="dot-circle" v-if="artwork.itemType === 'digiart'"/> Buying at Radicle</h2>
      <p>A small platform fee is split between yourself and the buyer. Artists and Gallery owners who
      brought the work to Radicle also benefit from residual payments on secondary sales.</p>
      <p v-if="artwork.itemType === 'digiart'">
        Digital artwork is automatically transferred to the buyer. Once payment is confirmed on the blockchain
        the bitcoin will be forwarded to seller and the provenance recored of this piece will be updated
        on chain to reflect you as the new owner.
      </p>
      <p v-else>For physical artwork where shipping applies your payment is held in escrow
      until you have received the artwork. Please check your
      <router-link to="/profile/update">email and shipping address details</router-link>
      are up to date.</p>
      <p>{{invoice.invoiceAmounts.totalBitcoin}}</p>
      <p>{{invoice.sellerTransaction}}</p>
    </mdb-col>
  </mdb-row>
</div>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbRow, mdbCol, mdbIcon } from "mdbvue";
import QRCode from "qrcode";
import moneyUtils from "@/services/moneyUtils";
import AddressForm from "../utils/AddressForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ShoppingBuyerView",
  components: {
    mdbRow,
    mdbCol,
    mdbIcon
  },
  props: {
    artwork: null
  },
  data() {
    return {
    };
  },
  mounted() {
    let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.artwork.id);
    if (this.artwork.itemType === "digiart" && !invoice.sellerTransaction) {
      // initiate transaction to pay it forward, do the provenance change and
      // update the artwork record to show the buyer as owner.
      this.$store.dispatch("invoiceStore/paySeller", this.artwork).then(invoiceClaim => {
      })
    }
  },
  computed: {
    purchaseBegun() {
      return this.artwork.status === this.$store.state.constants.statuses.artwork.PURCHASE_BEGUN;
    },
    invoice() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.artwork.id);
      return invoice;
    },
    confirmations() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.artwork.id);
      return (!invoice || !invoice.buyerTransaction) ? "unpaid" : invoice.buyerTransaction.confirmations;
    },
  },
  methods: {
  }
};
</script>
