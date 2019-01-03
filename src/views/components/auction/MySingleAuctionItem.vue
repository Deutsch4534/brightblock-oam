<template>
<div class="md-layout md-gutter">
  <div class="md-layout-item md-size-25 md-xsmall-size-100">
    <img :src="artwork.image" :alt="artwork.title" class="mr-3 img-fluid" style="max-width: 250px;">
  </div>
  <div v-if="sellingItem">
    <h4>{{artwork.title}}</h4>
    {{artwork.description}}
    <ul>
      <li v-if="!item.inplay"><a href v-on:click="activateBidding">Activate Bidding</a></li>
      <li v-else><a href v-on:click="deactivateBidding">Deactivate Bidding</a></li>
      <li><a href v-on:click="removeFromAuction">Remove from Auction</a></li>
    </ul>
  </div>
  <div v-else>
    <h4>{{artwork.title}}</h4>
    <ul>
      <li v-if="artwork.bcitem && artwork.bcitem.itemIndex === -1"><router-link :to="registerUrl" class="artwork-action">Register</router-link></li>
      <li v-if="canSell"><router-link :to="registerForAuctionUrl">Add to Auction</router-link></li>
    </ul>
  </div>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleAuctionItem",
  components: {},
  props: {
    auctionId: null,
    sellingItem: false,
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      sellAuctionActive: false
    };
  },
  mounted() {},
  methods: {
    removeFromAuction() {
      this.$store
        .dispatch("myArtworksStore/removeFromAuction", {
          auctionId: this.auctionId,
          itemId: this.item.itemId
        })
        .then(() => {})
        .catch(e => {
          console.log(e.message);
        });
    },
    activateBidding() {
      this.$store.commit("myAuctionsStore/activateItemEvent", {
        auctionId: this.auctionId,
        itemId: this.item.itemId
      });
    },
    deactivateBidding() {
      this.$store.commit("myAuctionsStore/activateItemEvent", {
        auctionId: this.auctionId,
        itemId: null
      });
    }
  },
  computed: {
    canSell() {
      let artwork = this.$store.getters["myArtworksStore/myArtwork"](
        this.item.itemId
      );
      let bcitem = artwork.bcitem;
      return bcitem && bcitem.itemIndex > -1;
    },
    artwork() {
      return this.$store.getters["myArtworksStore/myArtwork"](this.item.itemId);
    },
    registerUrl() {
      let url = `/my-artwork/register/${this.item.itemId}`;
      url += "?from=auctions&auctionId=" + this.auctionId;
      return url;
    },
    registerForSaleUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](
        this.item.itemId
      );
      let id = this.artwork.id;
      let amount = a.saleData ? a.saleData.amount : 0;
      let currency = a.saleData ? a.saleData.fiatCurrency : "EUR";
      let url = `/my-artwork/register-for-sale/${id}/${amount}/${currency}`;
      url += "?from=auctions&auctionId=" + this.auctionId;
      return url;
    },
    registerForAuctionUrl() {
      let a = this.$store.getters["myArtworksStore/myArtwork"](
        this.item.itemId
      );
      let id = this.artwork.id;
      let r = a.saleData ? a.saleData.reserve : 0;
      let i = a.saleData ? a.saleData.increment : 0;
      let c = a.saleData ? a.saleData.fiatCurrency : "EUR";
      let aid = this.auctionId;
      // if (a.saleData && a.saleData.auctionId) {
      //  aid = a.saleData.auctionId;
      // }
      let url = `/my-artwork/register-for-auction/${id}/${aid}/${r}/${i}/${c}`;
      url += "?from=auctions";
      return url;
    },
    debugMode() {
      return this.$store.getters["isDebugMode"];
    }
  }
};
</script>
<style lang="scss" scoped>
.md-layout-item {
  margin-bottom: 20px;
}
</style>
