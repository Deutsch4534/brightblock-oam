<template>
<footer class="page-footer fixed-bottom">
  <div class="container">
    <div class="md-layout md-gutter md-alignment-bottom-space-between">
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100">
        <span v-html="fiatMessage"></span>
      </div>
      <div class="md-layout-item md-medium-size-20 md-small-size-50 md-xsmall-size-100">
        <span v-html="ethMessage"></span>
      </div>
      <div class="md-layout-item md-medium-size-20 md-small-size-50 md-xsmall-size-100">
        <span v-html="btcMessage"></span>
      </div>
      <div class="md-layout-item md-medium-size-30 md-small-size-50 md-xsmall-size-100">
        <md-button :disabled="!purchaseState.canBuy" v-bind:class="{ 'md-primary': purchaseState.canBuy, 'md-gray': !purchaseState.canBuy }"  @click="buyArtwork()">
          <md-icon>buy</md-icon> buy
        </md-button>
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
