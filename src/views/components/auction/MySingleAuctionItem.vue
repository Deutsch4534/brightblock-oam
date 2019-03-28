<template>
<mdb-row class="mb-3">
  <mdb-col lg="5" xl="4">
    <mdb-view hover class="rounded z-depth-1-half mb-lg-0 mb-4">
      <img class="img-fluid" :src="artwork.image" :alt="artwork.title" />
      <a><mdb-mask overlay="white-slight" waves/></a>
    </mdb-view>
  </mdb-col>
  <mdb-col lg="7" xl="8" v-if="sellingItem">
    <h3 class="font-weight-bold mb-3 p-0">
      <strong>{{artwork.title}}</strong>
    </h3>
    <p class="dark-grey-text"><description-overflow :text="artwork.description"/></p>
    <p>by
      <a class="font-weight-bold">{{artwork.artist}}</a>, {{created}}</p>
    <br/>
    <a v-if="!item.inplay" href @click.prevent="activateBidding"><mdb-btn color="white" size="md">Activate Bidding</mdb-btn></a>
    <a v-else href @click.prevent="deactivateBidding"><mdb-btn color="white" size="md">Deactivate Bidding</mdb-btn></a>
    <a href @click.prevent="removeFromAuction"><mdb-btn color="white" size="md">Remove from Auction</mdb-btn></a>
  </mdb-col>
  <mdb-col lg="7" xl="8" v-else>
    <h3 class="font-weight-bold mb-3 p-0">
      <strong>{{artwork.title}}</strong>
    </h3>
    <p class="dark-grey-text"><description-overflow :text="artwork.description"/></p>
    <p>by
      <a class="font-weight-bold">{{artwork.artist}}</a>, 19/04/2018</p>
    <br/>
    <router-link v-if="artwork.bcitem && artwork.bcitem.itemIndex === -1" :to="registerUrl" class="artwork-action"><mdb-btn color="white" size="md">Register</mdb-btn></router-link>
    <br/>
    <router-link v-if="canSell" :to="registerForAuctionUrl"><mdb-btn color="white" size="md">Add to Auction</mdb-btn></router-link>
  </mdb-col>
</mdb-row>

</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardBody, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';
import moment from "moment";
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MySingleAuctionItem",
  components: {
    DescriptionOverflow,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn
  },
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
    created() {
      if (this.artwork.created) {
        return moment(this.artwork.created).format("YYYY-MM-DD");
      }
      return moment(this.artwork.id).format("DD/MMM/YYYY");
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
      return this.$store.state.constants.debugMode;
    }
  }
};
</script>
<style scoped>
</style>
