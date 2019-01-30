<template>
<div class="row">
  <div class="col-md-12">
    <span class="white-text d-flex justify-content-start" v-html="fiatMessage"></span>
    <span class="white-text d-flex justify-content-start" v-html="ethMessage"></span>
    <span class="white-text d-flex justify-content-start" v-html="btcMessage"></span>
    <a class="white-text d-flex justify-content-end"><mdb-btn :disabled="!purchaseState.canBuy" v-bind:class="{ 'white': purchaseState.canBuy, 'grey': !purchaseState.canBuy }"  @click="buyArtwork()">buy</mdb-btn></a>
  </div>
</div>
</template>

<script>
import { mdbIcon, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuyArtworkForm",
  components: {
    mdbIcon,
    mdbBtn
  },
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
