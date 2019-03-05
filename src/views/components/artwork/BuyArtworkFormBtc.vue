<template>
<mdb-row class="pt-1">
  <mdb-col col="12">
    <p class="h5-responsive serif-italic">{{registerMessageBtc}}</p>
    <div>
      {{moneySymbol}} <strong>{{artwork.saleData.amount}}</strong> EUR = <strong>{{btcMessage}}</strong> BTC
    </div>
    <div class="row">
      <div class="col-12 mt-3">
        <router-link v-if="iamowner" to="/my-artworks"><mdb-btn size="md" class="btn-main btn-block">{{label}}</mdb-btn></router-link>
        <mdb-btn v-else @click="buyArtwork()" :disabled="!purchaseState.canBuy" type="submit" size="md" class="btn-main btn-block">{{label}}</mdb-btn>
      </div>
    </div>
    <div class="w-100"></div>
  </mdb-col>
</mdb-row>
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
    iamowner: false,
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
    },
  },
  computed: {
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
    moneySymbol() {
      try {
        return moneyUtils.currencySymbol(this.artwork.saleData.fiatCurrency);
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
        if (this.iamowner) {
           return "manage artwork";
        }
        let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
        if (this.artwork && myProfile.username === this.artwork.owner) {
          return "Payment Info";
        }
        let value = moneyUtils.valueInBitcoin(this.artwork.saleData.fiatCurrency, this.artwork.saleData.amount);
        return "Buy Artwork " + value + " BTC";
      } catch (e) {
        console.log("Error formatting buy label: " + e);
        return "Buy Now";
      }
    }
  }
};
</script>
