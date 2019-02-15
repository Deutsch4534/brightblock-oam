<template>
  <div>
    <!-- TODO: Connect currency buttons to conditionally display price next to button -->
    <div>
      {{fiatMessage}} <mdb-btn size="sm" color="white" rounded>EUR</mdb-btn>
      {{btcMessage}} <mdb-btn size="sm" color="white" rounded>BTC</mdb-btn>
    </div>
    <div class="d-flex align-items-center justify-content-start pt-5">
        <mdb-btn v-bind:class="{ 'white': purchaseState.canBuy, 'grey': !purchaseState.canBuy }" color="white"
                 size="lg" @click="buyArtwork()" class="ml-4">{{label}}
        </mdb-btn>
    </div>
  </div>
</template>

<script>
import { mdbIcon, mdbBtn } from 'mdbvue';
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuyArtworkFormBtc",
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
        let symbol = moneyUtils.currencySymbol(this.artwork.saleData.fiatCurrency);
        let fc = this.artwork.saleData.fiatCurrency;
        let amount = this.artwork.saleData.amount;
        return symbol + " " + amount;
      } catch (e) {
        return "";
      }
    },
    ethMessage() {
      try {
        let value = moneyUtils.valueInEther(this.artwork.saleData.fiatCurrency, this.artwork.saleData.amount);
        return value;
      } catch (e) {
        return "";
      }
    },
    btcMessage() {
      try {
        let value = moneyUtils.valueInBitcoin(this.artwork.saleData.fiatCurrency, this.artwork.saleData.amount);
        return value;
      } catch (e) {
        return "";
      }
    },
    label() {
      try {
        let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
        if (myProfile.username === this.artwork.owner) {
          return "Show Addresses";
        }
        return "Purchase";
      } catch (e) {
        return "Punchase";
      }
    }
  }
};
</script>
