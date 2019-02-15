<template>
<div class="container mt-5">
  <mdb-card-body>
    <mdb-card-title>
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">Sell in Auction</div>
          <div class="popover-body">
            Choose this to be able to add this item to an auction later on.
          </div>
        </div>
        <a @click.prevent="" slot="reference">Sell in Auction <mdb-icon far icon="question-circle" /></a>
      </mdb-popover>
    </mdb-card-title>
    <h5 class="my-4">{{artwork.title}}</h5>
    <mdb-card-text>
      <form @submit.prevent="validate">
        <p v-if="artwork.saleData.auctionId"><a class="button" v-on:click="removeFromAuction">remove from auction {{auctionTitle}}</a></p>
        <p>This item can be bought via online bidding - the reserve is the minimum price you will accept.</p>
        <p v-if="errors.length" :key="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors" :key="error.id">{{ error.message }}</li>
          </ul>
        </p>
        <div class="row">
          <div class="col-6">
            <mdb-popover trigger="click" :options="{placement: 'top'}">
              <div class="popover">
                <div class="popover-header">Currency</div>
                <div class="popover-body">
                  The artwork will be sold for the amount of bitcoin that is equivalent to the
                  sale value in the Fiat currency you set here.
                </div>
              </div>
              <a @click.prevent="" slot="reference">Select Currency <mdb-icon far icon="question-circle" /></a>
            </mdb-popover>
            <select class="browser-default custom-select" v-model="currency" id="currency" name="currency">
              <option v-for="(value,key) in fiatRates" :key="key" :value="key">{{ key }}</option>
            </select>
            <div class="invalid-feedback">
              Please select the currency!
            </div>
            <p class="">
              {{conversionMessage}}
            </p>
          </div>
          <div class="col-md-6">
            <mdb-popover trigger="click" :options="{placement: 'top'}">
              <div class="popover">
                <div class="popover-header">Select Auction</div>
                <div class="popover-body">
                  Add this item to an auction that you have set up and that have not yet finished.
                </div>
              </div>
              <a @click.prevent="" slot="reference">Select Auction</a>
            </mdb-popover>
            <select class="browser-default custom-select" v-model="auctionId" id="auctionId" name="auctionId">
              <option v-for="(auction,key) in auctions" :key="key" :value="auction.auctionId">{{ auction.title }}</option>
            </select>
            <div class="invalid-feedback">
              Please select the auction!
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <mdb-popover trigger="click" :options="{placement: 'top'}">
              <div class="popover">
                <div class="popover-header">Reserve {{currencySymbol}}</div>
                <div class="popover-body">
                  Your artwork will not sell for less than this amount.
                </div>
              </div>
              <a @click.prevent="" slot="reference">Reserve {{currencySymbol}}</a>
            </mdb-popover>
            <input type="number" class="form-control" id="validationCustom02" step="1" placeholder="Reserve price" v-model="reserve" required>
            <p>
              {{valueInBitcoin(reserve)}} Btc / {{valueInEther(reserve)}} Eth
            </p>
            <div class="invalid-feedback">
              Please enter the reserve!
            </div>
          </div>
          <div class="col-md-6">
            <mdb-popover trigger="click" :options="{placement: 'top'}">
              <div class="popover">
                <div class="popover-header">Increment {{currencySymbol}}</div>
                <div class="popover-body">
                  The amount the value increases by after a bid is placed.
                </div>
              </div>
              <a @click.prevent="" slot="reference">Increment {{currencySymbol}}</a>
            </mdb-popover>
            <input type="number" class="form-control" id="validationCustom03" step="1" placeholder="increment value" v-model="increment" required>
            <p>
              {{valueInBitcoin(increment)}} Btc / {{valueInEther(increment)}} Eth
            </p>
            <div class="invalid-feedback">
              Please enter the increment!
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-6">
            <mdb-btn color="white" @click="closeModal" size="md">Cancel</mdb-btn>
            <mdb-btn color="white" @click="addToAuction" size="md">Save</mdb-btn>
            <mdb-btn v-if="artwork.saleData.auctionId" color="white" @click="removeFromAuction" size="md">Remove From Auction</mdb-btn>
          </div>
        </div>
      </form>
    </mdb-card-text>
  </mdb-card-body>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";
import { mdbPopover, mdbIcon, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "RegisterForAuction",
  components: {
    mdbCardBody,
    mdbPopover,
    mdbIcon,
    mdbCardTitle,
    mdbCardText,
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

    gotoSaleInfo: function() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
      let id = this.artwork.id;
      let amount = a.saleData ? a.saleData.amount : 0;
      let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
      return `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
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
      saleData.bitcoinTx = this.artwork.saleData.bitcoinTx;
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
          $self.closeModal();
        });
    }
  }
};
</script>
