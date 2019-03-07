<template>
<tr scope="row" v-if="invoice && invoice.label">
  <th scope="row">
    <router-link :to="invoiceUrl" class="inline-block">{{invoice.invoiceId}}</router-link>
  </th>
  <td>{{invoice.seller.blockstackId}}</td>
  <td>{{getArtworkTitle}}</td>
  <td>{{invoice.invoiceAmounts.totalFiat}} {{invoice.invoiceAmounts.fiatCurrency}}</td>
  <td>{{invoice.invoiceAmounts.totalBitcoin}}</td>
  <td>
    <router-link :to="invoiceUrl" class="inline-block">{{status}}</router-link>
  </td>
</tr>
</template>

<script>
import { mdbBtn } from "mdbvue";
import invoiceService from "@/services/invoiceService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "OrderItem",
  components: {
    mdbBtn
  },
  props: {
    invoice: {
      invoiceRates: {},
      invoiceAmounts: {}
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.dispatch("invoiceStore/fetchInvoice", this.invoice.artworkId);
    console.log("invocie: ", this.invoice);
  },
  methods: {},
  computed: {
    status() {
      if (this.invoice) {
        return invoiceService.getInvoiceLabelFromState(this.invoice.state);
      }
    },
    getArtworkTitle() {
      return this.invoice.title;
    },
    openOrderUrl() {
      this.$router.push("/order/" + this.invoice.invoiceId);
    },
    invoiceUrl() {
      let theId = this.invoice.invoiceId;
      if (!theId) {
        theId = this.invoice.artworkId;
      }
      return `/order/${theId}`;
    }
  }
};
</script>
<style scoped>
  .subtitle,
  .card-body p {
    color: #000!important;
  }
</style>
