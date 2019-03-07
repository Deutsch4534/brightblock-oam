<template>
<mdb-row class="pt-1">
  <mdb-col col="12">
    <p class="h5-responsive serif-italic">{{registerMessageBtc}}</p>
    <div>
      {{moneySymbol}} <strong>{{artwork.saleData.amount}}</strong> EUR = <strong>{{btcMessage}}</strong> BTC
    </div>
    <div class="row">
      <div class="col-12 mt-3">

        <!-- i am owner - send this user to my artwork / my artworks -->
        <router-link v-if="iamowner" to="/my-artworks">
          <mdb-btn rounded color="white" size="md" class="mr-1 ml-0 waves-light">manage artwork</mdb-btn>
        </router-link>

        <!-- order placed / purchase in progress - user has placed an order for this artwork or some other user? -->
        <div v-else-if="purchaseBegun">

          <router-link v-if="iambuyer" :to="invoiceUrl">
            <mdb-btn rounded color="white" size="md" class="mr-1 ml-0 waves-light">proceed to checkout</mdb-btn>
          </router-link>

          <mdb-btn v-else rounded color="white" :disabled="true" size="md" class="mr-1 ml-0 waves-light">sold</mdb-btn>

          <router-link to="/gallery">
            <mdb-btn rounded color="white" size="md" class="mr-1 ml-0 waves-light">continue browsing</mdb-btn>
          </router-link>

        </div>

        <!-- purchase not in progress - user is free to place order? -->
        <div v-else>
          <!-- <mdb-btn @click="buyArtwork()" rounded color="white" size="md" class="mr-1 ml-0 waves-light">BUY</mdb-btn> -->
          <mdb-btn @click="addToCart()" rounded color="white" size="md" class="mr-1 ml-0 waves-light">ADD TO CART</mdb-btn>
        </div>

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
    artwork: {
      type: Object,
      default() {
        return {
          bcitem: {}
        };
      },
    }
  },
  data() {
    return {
      orderPlaced: false
    };
  },
  methods: {
    buyArtwork() {
      this.$store.dispatch("invoiceStore/prepareNewInvoice", {artwork: this.artwork, saveInvoice: true}).then(invoice => {
        this.$router.push("/order/" + invoice.invoiceId);
      })
    },
    addToCart() {
      this.$store.dispatch("invoiceStore/prepareNewInvoice", {artwork: this.artwork, saveInvoice: true});
    }
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
    iamowner() {
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return profile.username === this.artwork.owner;
    },
    iambuyer() {
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.artwork.id);
      let profile = this.$store.getters["myAccountStore/getMyProfile"];
      return invoice || profile.username === this.artwork.buyer;
    },
    invoiceUrl() {
      return `/order/${this.artwork.id}`;
    },
    purchaseBegun() {
      let purchaseBegun = this.artwork.status === this.$store.state.constants.statuses.artwork.PURCHASE_BEGUN;
      let invoice = this.$store.getters["invoiceStore/getInvoiceById"](this.artwork.id);
      return invoice || purchaseBegun;
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
        let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
        if (this.artwork && myProfile.username === this.artwork.owner) {
          return "Payment Info";
        }
        let value = moneyUtils.valueInBitcoin(this.artwork.saleData.fiatCurrency, this.artwork.saleData.amount);
        return "ADD TO CART " + value + " BTC";
      } catch (e) {
        console.log("Error formatting buy label: " + e);
        return "Buy Now";
      }
    }
  }
};
</script>
