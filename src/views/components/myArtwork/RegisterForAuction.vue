<template>
<div>
  <md-dialog :md-active.sync="showModal" @md-closed="closeModal">
    <md-dialog-title>Sell via Auction</md-dialog-title>
    <md-dialog-content v-if="message">
      {{message}}
    </md-dialog-content>
    <md-dialog-content v-else>
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
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Select Currency</label>
            <md-select v-model="currency" id="currency" name="currency">
              <md-option v-for="(value,key) in fiatRates" :key="key" :value="key">{{ key }}</md-option>
            </md-select>
          </md-field>
          <p class="">
            {{conversionMessage}}
          </p>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Reserve {{currencySymbol}}</label>
            <md-input v-model="reserve" type="number" step="50" placeholder="Reserve price"></md-input>
          </md-field>
          <p id="amountHelpBlock" class="">
            {{valueInBitcoin(reserve)}} Btc / {{valueInEther(reserve)}} Eth
          </p>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Increment {{currencySymbol}}</label>
            <md-input v-model="increment" type="number" step="50" placeholder="Increment value"></md-input>
          </md-field>
          <p id="amountHelpBlock" class="">
            {{valueInBitcoin(increment)}} Btc / {{valueInEther(increment)}} Eth
          </p>
        </div>

        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Select Auction</label>
            <md-select v-model="auctionId" id="auctionId" name="auctionId">
              <md-option v-for="(auction,key) in auctions" :key="key" :value="auction.auctionId">{{auction.title}}</md-option>
            </md-select>
          </md-field>
          <p class="">
            {{conversionMessage}}
          </p>
        </div>

      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click.prevent="addToAuction">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "RegisterForAuction",
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
      this.showModal = false;
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
