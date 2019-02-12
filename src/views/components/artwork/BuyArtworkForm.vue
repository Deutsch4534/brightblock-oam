<template>
  <div>
    <!-- TODO: Connect currency buttons to conditionally display price next to button -->
    <div>
      <mdb-btn size="sm" color="white" rounded>EUR</mdb-btn>
      <mdb-btn size="sm" color="white" rounded>BTC</mdb-btn>
      <mdb-btn size="sm" color="white" rounded>ETH</mdb-btn>
    </div>
    <div class="d-flex align-items-center justify-content-start pt-5">
      <p v-html="fiatMessage" class="inline-block mb-0"></p>
      <p v-html="ethMessage" class="inline-block mb-0"></p>
      <p v-html="btcMessage" class="inline-block mb-0"></p>
        <mdb-btn :disabled="!purchaseState.canBuy"
                 v-bind:class="{ 'white': purchaseState.canBuy, 'grey': !purchaseState.canBuy }" color="white"
                 size="lg" @click="buyArtwork()" class="ml-4">purchase
        </mdb-btn>
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
