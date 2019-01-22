<template>
<div class="md-layout md-gutter">
  <div class="md-layout-item md-size-25 md-xsmall-size-100">
    <img :src="artwork.image" :alt="artwork.title" >
  </div>
  <div v-if="sellingItem">
    <h4>{{artwork.title}}</h4>
    {{artwork.description}}
    <br/>
    <a v-if="!item.inplay" href @click.prevent="activateBidding">Activate Bidding</a>
    <a v-else href @click.prevent="deactivateBidding">Deactivate Bidding</a>
    <br/>
    <a href @click.prevent="removeFromAuction">Remove from Auction</a>
  </div>
  <div v-else>
    <h4>{{artwork.title}}</h4>
    <router-link v-if="artwork.bcitem && artwork.bcitem.itemIndex === -1" :to="registerUrl" class="artwork-action">Register</router-link>
    <br/>
    <router-link v-if="canSell" :to="registerForAuctionUrl">Add to Auction</router-link>
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
      let itemId = this.item.itemId;
      let a = this.$store.getters["myArtworksStore/myArtwork"](itemId);
      if (!a) {
        a = {
          title: "unknown artwork"
        };
      }
      return a;
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
      return process.env.VUE_APP_DEBUG_MODE;
    }
  }
};
</script>
<style scoped>
.md-layout-item {
  margin-bottom: 20px;
}
</style>
