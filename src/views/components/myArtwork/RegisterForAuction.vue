<template>
<mdb-modal size="lg" v-if="showModal" @close="closeModal">
    <mdb-modal-header>
        <mdb-modal-title>Sell via Auction</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body v-if="message">
      {{message}}
    </mdb-modal-body>
    <mdb-modal-body v-else>
    <h5>{{artwork.title}}</h5>
    <form @submit.prevent="setPrice">
      <p v-if="artwork.saleData.auctionId"><a class="button" v-on:click="removeFromAuction">remove from auction {{auctionTitle}}</a></p>
      <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
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
          <label for="validationCustom02">Reserve {{currencySymbol}}</label>
          <input type="number" class="form-control" id="validationCustom02" step="50" placeholder="Reserve price" v-model="reserve" required>
          <div class="invalid-feedback">
            Please enter the reserve!
          </div>
        </div>
        <p>
          {{valueInBitcoin(reserve)}} Btc / {{valueInEther(reserve)}} Eth
        </p>
      </div>

      <div class="form-row">
        <div class="col-md-12 mb-3">
          <label for="validationCustom03">Increment {{currencySymbol}}</label>
          <input type="number" class="form-control" id="validationCustom03" step="50" placeholder="increment value" v-model="increment" required>
          <div class="invalid-feedback">
            Please enter the increment!
          </div>
        </div>
        <p>
          {{valueInBitcoin(increment)}} Btc / {{valueInEther(increment)}} Eth
        </p>
      </div>

      <div class="col-md-12 mb-3">
        <label for="validationCustom04">Select Auction</label>
        <select class="browser-default custom-select" v-model="auctionId" id="auctionId" name="auctionId">
          <option v-for="(auction,key) in auctions" :key="key" :value="auction.auctionId">{{ auction.title }}</option>
        </select>
        <div class="invalid-feedback">
          Please select the auction!
        </div>
      </div>
    </form>
    </mdb-modal-body>
    <mdb-modal-footer>
      <mdb-btn color="white" @click="addToAuction" size="md">Save</mdb-btn>
    </mdb-modal-footer>
</mdb-modal>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";
import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "RegisterForAuction",
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
      auctionId: -1,
      reserve: 0,
      increment: 0,
      currency: "EUR",
      artworkId: null,
      message: null,
      from: "/my-artworks"
    };
  },
  mounted() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.reserve = Number(this.$route.params.reserve);
    this.increment = Number(this.$route.params.increment);
    this.auctionId = Number(this.$route.params.auctionId);
    this.currency = this.$route.params.currency;
    if (this.$route.query.from && this.$route.query.from === "auctions") {
      this.from = "/my-auctions/manage/" + this.auctionId;
    }
  },
  computed: {
    fiatRates() {
      return this.$store.getters["conversionStore/getFiatRates"] || {};
    },

    artwork() {
      return this.$store.getters["myArtworksStore/myArtworkOrDefault"](
        this.artworkId
      );
    },

    auctionTitle() {
      if (!this.artwork.saleData) {
        return "-";
      }
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.artwork.saleData.auctionId
      );
      if (auction) {
        return auction.title;
      } else {
        return "-";
      }
    },

    auctions() {
      try {
        return this.$store.getters["myAuctionsStore/myAuctionsFuture"];
      } catch (e) {
        return [];
      }
    },

    conversionMessage() {
      return moneyUtils.conversionMessage(this.currency) || "no message";
    },

    currencySymbol() {
      return moneyUtils.currencySymbol(this.currency) || "no currency symbol";
    }
  },
  methods: {
    valueInBitcoin(amount) {
      return moneyUtils.valueInBitcoin(this.currency, amount);
    },

    closeModal: function() {
      this.$router.push(this.from);
      // this.$router.go(-2);
    },

    valueInEther(amount) {
      return moneyUtils.valueInEther(this.currency, amount);
    },

    validate: function(saleData) {
      this.errors = [];
      if (saleData.soid !== 2) {
        this.errors.push({ ERR_CODE: 301, message: "Selling via auction?" });
      }
      if (!saleData.reserve || saleData.reserve === 0) {
        this.errors.push({
          ERR_CODE: 302,
          message: "Reserve required if selling by auction."
        });
      }
      if (!saleData.increment || saleData.increment === 0) {
        this.errors.push({
          ERR_CODE: 303,
          message: "Increment required if selling by auction."
        });
      }
      if (!saleData.auctionId) {
        this.errors.push({
          ERR_CODE: 304,
          message: "Please select an auction for this item."
        });
      }
    },
    removeFromAuction() {
      let $self = this;
      this.$store
        .dispatch("myArtworksStore/removeFromAuction", {
          auctionId: this.artwork.saleData.auctionId,
          itemId: this.artwork.id
        })
        .then(() => {
          $self.closeModal();
        })
        .catch(e => {
          console.log(e.message);
          $self.closeModal();
        });
    },
    addToAuction() {
      let saleData = moneyUtils.buildSaleDataFromUserInput(
        this.auctionId,
        this.currency,
        0,
        this.reserve,
        this.increment
      );
      this.validate(saleData);
      if (this.errors.length > 0) {
        return;
      }
      let $self = this;
      $self.message = "Please wait while we update the data.";
      this.artwork.saleData = saleData;
      this.$store
        .dispatch("myArtworksStore/addToAuction", this.artwork)
        .then(() => {
          $self.message = null;
          $self.closeModal();
        })
        .catch(e => {
          $self.message = e.message;
          console.log(e.message);
        });
    }
  }
};
</script>
