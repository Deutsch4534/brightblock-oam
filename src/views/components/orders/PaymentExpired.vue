<template>
<div class="row text-center">
  <div class="col-md-12 pt-3">
    PAYMENT EXPIRED
  </div>
  <div class="col-md-12">
    <img class="img-fluid" :src="qrImage" alt="artwork.title" style="width: 90%;">
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "PaymentExpired",
  components: {
  },
  props: {
    invoiceClaim: null
  },
  data() {
    return {
      qrImage: require("@/assets/img/missing/artwork-missing.jpg")
    };
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
};
</script>
