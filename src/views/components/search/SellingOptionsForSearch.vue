<template>
<div class="">
  <div v-if="sellingBuyNow">
    <button class="btn btn-primary" @click="routeToBuyNow">Buy Now</button>
  </div>
  <div v-else-if="sellingAuction">
    <button class="btn btn-primary" @click="routeToPublicAuction">Open Auction</button>
    <button class="btn btn-primary" @click="routeToManageAuction">Manage Auction</button>
  </div>
  <div v-else>
    <h6>Not Selling</h6>
  </div>
</div>
</template>

<script>
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SellingOptions",
  props: {
    artwork: {
      saleData: {}
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    routeToManageAuction() {
      let r = `/my-auctions/manage/${this.artwork.saleData.auctionId}`;
      this.$router.push(r);
    },
    routeToPublicAuction() {
      let r = `/online-auction/${this.artwork.owner}/${
        this.artwork.saleData.auctionId
      }`;
      this.$router.push(r);
    },
    routeToBuyNow() {
      let r = `/artworks/${this.artwork.owner}/${this.artwork.id}`;
      this.$router.push(r);
    }
  },
  computed: {
    sellingBuyNow() {
      let fb = this.$store.state.constants.featureBitcoin;
      let priceSet;
      if (fb) {
        priceSet = this.artwork.saleData.amount > 0;
      } else {
        priceSet = this.artwork.bcitem && this.artwork.bcitem.price > 0;
      }
      return priceSet && this.artwork.saleData.soid === 1;
    },
    sellingAuction() {
      return (
        this.artwork.saleData.soid === 2 && this.artwork.saleData.auctionId > 0
      );
    },
    sellingAmount() {
      let priceSet = this.artwork.bcitem && this.artwork.bcitem.price > 0;
      if (priceSet) {
        return this.artwork.saleData.amount;
      } else {
        return 0;
      }
    },
    canManageAuction() {
      let auction = this.$store.getters["myAuctionsStore/myAuction"](
        this.artwork.saleData.auctionId
      );
      if (!auction) return false;
      let username = this.$store.getters["myAccountStore/getMyProfile"]
        .username;
      return auction.administrator === username;
    }
  }
};
</script>
