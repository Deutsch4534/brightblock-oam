<template>
<footer class="page-footer fixed-bottom">
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <span v-html="fiatMessage"></span>
      </div>
      <div class="col-md-2">
        <span v-html="ethMessage"></span>
      </div>
      <div class="col-md-2">
        <span v-html="btcMessage"></span>
      </div>
      <div class="col-md-4">
        <button :disabled="!purchaseState.canBuy" v-bind:class="{ 'primary': purchaseState.canBuy, 'md-gray': !purchaseState.canBuy }"  @click="buyArtwork()">
          <mdb-icon icon="money-bill-alt" /> buy
        </button>
      </div>
    </div>
  </div>
</footer>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuyArtworkForm",
  props: {
    purchaseState: {},
    artwork: {
      type: Object,
      default() {
        return {
          bcitem: {}
        };
      }
    }
  },
  methods: {
    buyArtwork() {
      this.$emit("buy");
    }
  },
  computed: {
    fiatMessage() {
      try {
        return (
          this.artwork.bcitem.fiatCurrencySymbol +
          " " +
          this.artwork.bcitem.priceInFiat +
          " " +
          this.artwork.bcitem.fiatCurrency +
          " "
        );
      } catch (e) {
        return "";
      }
    },
    ethMessage() {
      try {
        return this.artwork.bcitem.priceInEth + " ETH";
      } catch (e) {
        return "";
      }
    },
    btcMessage() {
      try {
        return this.artwork.bcitem.priceInBtc + " BTC";
      } catch (e) {
        return "";
      }
    }
  }
};
</script>
