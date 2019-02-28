<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <invoice-details :invoiceClaim="invoiceClaim" v-if="showInvoiceDetails"/>
</mdb-container>
</template>

<script>
import InvoiceDetails from "./components/invoice/InvoiceDetails";
import { mdbContainer, mdbCol, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Invoice",
  bodyClass: "index-page",
  components: {
    InvoiceDetails,
    mdbContainer,
    mdbRow,
    mdbCol,
  },
  data() {
    return {
      invoiceClaim: {
        invoiceAmounts: {},
        invoiceRates: {}
      },
      showInvoiceDetails: false
    };
  },
  mounted() {
    this.invoiceId = Number(this.$route.params.invoiceId);
    this.$store.dispatch("invoiceStore/fetchInvoice", this.invoiceId).then(invoiceClaim => {
      if (invoiceClaim) {
        this.invoiceClaim = invoiceClaim;
      } else {
        this.invoiceClaim = this.$store.getters["invoiceStore/getPreparedInvoice"](this.artwork);
      }
      this.showInvoiceDetails = true;
    })
  },
  computed: {
  },
  methods: {}
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
