<template>
<div class="container">
  <mdb-row class="pt-3">
    <mdb-col col="12">
      <h2 class="h5-responsive"><mdb-icon title="Digital work" far icon="dot-circle" v-if="artwork.itemType === 'digiart'"/> Selling at Radicle</h2>
      <p>A small platform fee is split between yourself and the buyer. Artists and Gallery owners who
      brought the work to Radicle also benefit from residual payments on secondary sales.</p>
      <p v-if="artwork.itemType === 'digiart'">
        Digital artwork is automatically transferred to the new owner. Once payment is confirmed on the blockchain
        the bitcoin will be forwarded to the bitcoin address listed in your profile.
      </p>
      <p v-else>For physical artwork where shipping applies we hold payment from the buyer in an escrow
      until the buyer confirms receipt of the artwork. The buyers shipping address is displayed below.</p>
      <div v-if="purchaseBegun">
        <p>Your artwork has been bought by {{artwork.owner}}</p>
        <p>Please arrange for the artwork to be shipped to;</p>
        <p>{{buyerShippingAddress}}</p>
      </div>
    </mdb-col>
  </mdb-row>
</div>
</template>

<script>
import xhrService from "@/services/xhrService";
import { mdbRow, mdbCol, mdbIcon } from "mdbvue";
import QRCode from "qrcode";
import moneyUtils from "@/services/moneyUtils";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ShoppingOwnerView",
  components: {
    mdbRow,
    mdbCol,
    mdbIcon
  },
  props: {
    artwork: null
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
    buyerShippingAddress() {
      let artwork = this.artwork;
      let buyer = this.$store.getters["userProfilesStore/getShippingAddress"](artwork.buyer, artwork.owner);
      return buyer;
    },
    purchaseBegun() {
      return this.artwork.status === this.$store.state.constants.statuses.artwork.PURCHASE_BEGUN;
    },
  },
  methods: {
  }
};
</script>
