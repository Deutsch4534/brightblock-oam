<template>
  <div class="container mt-5">
    <mdb-row>
      <div class="col-12 mb-3">
        <h2>Checkout</h2>
      </div>
    </mdb-row>
    <mdb-row v-if="!hasOrders">
      <div class="col-12 mb-5">
        <p class="h1-responsive mb-5">No orders found!</p>
        <p><router-link to="/my-artwork/upload" class="btn btn-white btn-sm btn-rounded ripple-parent">Upload Artwork</router-link> to get started...</p>
      </div>
    </mdb-row>
    <ul class="list-unstyled" v-else>
      <order-item v-for="invoice in orders" :key="invoice.artworkId" :debugMode="debugMode" :orderId="invoice.invoiceId" :artworkId="invoice.artworkId"/>
    </ul>
  </div>
</template>

<script>
import OrderItem from "./components/orders/OrderItem";
import { mdbContainer, mdbCol, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Orders",
  bodyClass: "index-page",
  components: {
    OrderItem,
    mdbContainer,
    mdbCol,
    mdbRow,
  },
  data() {
    return {
      orderId: null
    };
  },
  mounted() {
    this.orderId = Number(this.$route.query.orderId);
  },
  computed: {
    orders() {
      let orders = [];
      if (this.orderId) {
        let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.orderId);
        orders.push(invoice);
      } else {
        orders = this.$store.getters["invoiceStore/getInvoices"];
      }
      return orders;
    },
    debugMode() {
      return this.$store.getters["isDebugMode"];
    },
    hasOrders() {
      let orders = this.$store.getters["invoiceStore/getInvoices"];
      if (!orders) {
        return 0;
      }
      return orders.length;
    }
  }
};
</script>
<style>
</style>
