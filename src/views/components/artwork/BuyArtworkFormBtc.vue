<template>
<mdb-col col="12" md="8" class="pl-md-5" v-else>
  <mdb-row class="pt-3">
    <mdb-col col="12">
      <p class="h5-responsive serif-italic">{{registerMessageBtc}}</p>
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
    </mdb-col>
  </mdb-row>
</mdb-col>
</template>

<script>
import { mdbIcon, mdbBtn } from 'mdbvue';
import moneyUtils from "@/services/moneyUtils";
import { mdbContainer, mdbCol, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "BuyArtworkFormBtc",
  components: {
    mdbIcon,
    mdbBtn,
    mdbContainer, mdbCol, mdbRow
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
    registerMessageBtc() {
      let artwork = this.artwork;
      let message;
      try {
        let registered = artwork.bitcoinTx;
        let price = artwork.saleData.amount > 0;
        if (!registered) {
          message = "Artwork not registered on blockchain."
        } else {
          if (price) {
            message = "Artwork is registered on blockchain."
          } else {
            message = "Artwork is registered on chain but is not currently for sale."
          }
        }
      } catch (e) {
          message = "Unregistered.";
      }
      return message;
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
