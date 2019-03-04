<template>
<tr scope="row" v-if="invoice && invoice.label">
  <th scope="row">
    <router-link :to="invoiceUrl" class="inline-block">id:  {{invoice.invoiceId}}</router-link>
  </th>
  <td>{{invoice.seller.blockstackId}}</td>
  <td>{{invoice.label}}</td>
  <td>{{invoice.invoiceAmounts.totalFiat}} {{invoice.invoiceAmounts.fiatCurrency}}</td>
  <td>{{invoice.invoiceAmounts.totalBitcoin}}</td>
  <td>{{confirmations}}</td>
</tr>
</template>

<script>
import { mdbBtn } from "mdbvue";
import invoiceService from "@/services/invoiceService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "InvoiceItem",
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
    confirmations() {
      if (this.invoice) {
        return invoiceService.getInvoiceState(this.invoice);
      }
    },
    invoiceUrl() {
      let theId = this.invoice.invoiceId;
      if (!theId) {
        theId = this.invoice.artworkId;
      }
      return `/invoice/${theId}`;
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
