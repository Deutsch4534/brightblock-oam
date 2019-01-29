<template>
<mdb-modal size="lg" v-if="showModal" @close="closeModal">
    <mdb-modal-header>
        <mdb-modal-title>Sell via Buy Now</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body  v-if="message">
      {{message}}
    </mdb-modal-body>
    <mdb-modal-body v-else>

    <h5 class="modal-title">{{artwork.title}}</h5>
    <p class="form-text text-muted">Note: set the value to 0 to remove from sale.</p>
    <form @submit.prevent="setPrice">
      <p>This item can be bought for the price you specify.</p>
      <p v-if="errors.length" :key="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
        </ul>
      </p>
      <div class="col-md-12 mb-3">
        <label for="validationCustom01">Select Currency</label>
        <select class="browser-default custom-select" v-model="currency" id="currency" name="currency">
          <option v-for="(value,key) in fiatRates" :key="key" :value="key">{{ key }}</option>
        </select>
        <div class="invalid-feedback">
        Please select the currency!
        </div>
      </div>
      <p class="">
        {{conversionMessage}}
      </p>

      <div class="form-row">
        <div class="col-md-12 mb-3">
          <label for="validationCustom01">Amount {{currencySymbol}}</label>
          <input type="number" class="form-control" id="validationCustom01" step="50" placeholder="Sale value of artwork" v-model="amount" required>
          <div class="invalid-feedback">
            Please enter the amount!
          </div>
        </div>
        <p id="amountHelpBlock" class="">
          {{valueInBitcoin}} Btc / {{valueInEther}} Eth
        </p>
      </div>
    </form>

    </mdb-modal-body>
    <mdb-modal-footer>
        <mdb-btn color="primary" size="sm" @click="setPrice" v-if="!message">Set Price</mdb-btn>
    </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import notify from "@/services/notify";
import ethereumService from "@/services/ethereumService";
import moneyUtils from "@/services/moneyUtils";
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "RegisterForSale",
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  },
  data() {
    return {
      errors: [],
      showModal: true,
      artworkId: null,
      message: null,
      amount: 0,
      currency: "EUR",
      from: "/my-artworks"
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.amount = Number(this.$route.params.amount);
    this.currency = this.$route.params.currency;
    if (this.$route.query.from && this.$route.query.from === "auctions") {
      this.from = "/my-auctions/manage/" + this.$route.query.auctionId;
    }
  },
  computed: {
    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"];
    },

    artwork() {
      return this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
    },

    auctions() {
      return this.$store.getters["myAuctionsStore/myAuctionsFuture"];
    },

    valueInBitcoin() {
      return moneyUtils.valueInBitcoin(this.currency, this.amount);
    },

    valueInEther() {
      return moneyUtils.valueInEther(this.currency, this.amount);
    },

    conversionMessage() {
      return moneyUtils.conversionMessage(this.currency);
    },

    currencySymbol() {
      return moneyUtils.currencySymbol(this.currency);
    }
  },
  methods: {
    validate: function() {
      this.errors = [];
    },

    closeModal: function() {
      this.$router.push(this.from);
    },

    setPrice: function() {
      let artwork = this.artwork;
      this.validate(artwork.saleData);
      if (this.errors.length > 0) {
        return;
      }

      artwork.saleData.soid = 1;
      artwork.saleData.amount = Number(this.amount);
      if (artwork.saleData.amount === 0) {
        artwork.saleData.soid = 0;
      }
      artwork.saleData.reserve = 0;
      artwork.saleData.increment = 0;
      artwork.saleData.fiatCurrency = this.currency;
      let fiatRates = this.$store.getters["conversionStore/getFiatRates"];
      artwork.saleData.initialRateBtc = fiatRates[this.currency]["15m"];
      let ethToBtc = this.$store.getters["conversionStore/getCryptoRate"](
        "eth_btc"
      );
      artwork.saleData.initialRateEth = ethToBtc;
      artwork.saleData.amountInEther = moneyUtils.valueInEther(
        this.currency,
        artwork.saleData.amount
      );
      artwork.saleData.auctionId = null;

      this.message =
        "Setting Price: Please confirm the transaction in your wallet...";
      let priceData = {
        itemIndex: artwork.bcitem.itemIndex,
        amountInWei: moneyUtils.valueInWei(
          artwork.saleData.fiatCurrency,
          artwork.saleData.amount
        )
      };
      let $self = this;
      ethereumService.setPriceOnChain(
        priceData,
        function(result) {
          artwork.bcitem.setPriceTxId = result.txId;
          artwork.bcitem.status = "price-set";
          $self.$store.commit("myArtworksStore/addMyArtwork", artwork);
          $self.message =
            "Setting Price: Blockchain called - saving data changes...";
          $self.$store
            .dispatch("myArtworksStore/updateArtwork", artwork)
            .then(() => {
              notify.info({
                title: "Register Artwork.",
                text: "Your user storage has been updated."
              });
              $self.closeModal();
            });
        },
        function(error) {
          notify.error({
            title: "Register Artwork.",
            text: "Error setting price for your item. <br>" + error.message
          });
        }
      );
    }
  }
};
</script>
