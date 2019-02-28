<template>
  <mdb-container class="mt-5" v-if="!hasInvoices">
    <mdb-row>
      <div class="col-12 mb-5">
        <p class="h1-responsive mb-5">No invoices found!</p>
        <p><router-link to="/my-artwork/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Artwork</router-link> to get started...</p>
      </div>
    </mdb-row>
  </mdb-container>
  <mdb-container class="mt-5" v-else>
    <mdb-row>
      <div class="col-12">
        <h1 class="h1-responsive mb-5">Invoices</h1>
      </div>
      <div class="col-12">
        <div class="row">
          <mdb-tbl responsive>
            <mdb-tbl-head color="primary-color" textWhite>
              <tr>
                <th>#</th>
                <th>payee</th>
                <th>label</th>
                <th>total fiat</th>
                <th>total btc</th>
                <th>paid</th>
              </tr>
            </mdb-tbl-head>
            <mdb-tbl-body>
              <invoice-item v-for="invoice in invoices" :key="invoice.artworkId" :invoice="invoice" class="col-sm-6 col-md-4 col-lg-4"/>
            </mdb-tbl-body>
          </mdb-tbl>
        </div>
      </div>
    </mdb-row>
  </mdb-container>
</template>

<script>
import InvoiceItem from "./components/invoice/InvoiceItem";
import { mdbContainer, mdbCol, mdbRow } from 'mdbvue';
import { mdbTbl, mdbTblHead, mdbTblBody } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Invoices",
  bodyClass: "index-page",
  components: {
    InvoiceItem,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbTbl,
    mdbTblHead,
    mdbTblBody
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    invoices() {
      let invoices = this.$store.getters["invoiceStore/getInvoices"];
      if (invoices && invoices.records) {
        return invoices.records;
      }
    },
    hasInvoices() {
      let invoices = this.$store.getters["invoiceStore/getInvoices"];
      if (!invoices || !invoices.records) {
        return 0;
      }
      return invoices.records.length;
    }
  }
};
</script>
<style>
</style>
