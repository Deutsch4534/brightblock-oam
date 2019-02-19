<template>
  <div>
    <!-- TODO: Connect currency buttons to conditionally display price next to button -->
    <div>
      {{fiatMessage}} <mdb-btn size="sm" color="white" rounded>EUR</mdb-btn>
      {{btcMessage}} <mdb-btn size="sm" color="white" rounded>BTC</mdb-btn>
    </div>
    <div class="row">
      <div class="col-12 mt-3">
        <mdb-btn @click="buyArtwork()" :disabled="!purchaseState.canBuy" type="submit" size="md" class="btn-main btn-block">{{label}}</mdb-btn>
      </div>
    </div>
    <div class="w-100"></div>
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
        if (this.artwork && myProfile.username === this.artwork.owner) {
          return "Payment Info";
        }
        return "Buy Artwork";
      } catch (e) {
        return "Buy Now";
      }
    }
  }
};
</script>
