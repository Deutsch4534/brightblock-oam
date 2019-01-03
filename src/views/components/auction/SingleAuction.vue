<template>
<div class="md-layout md-gutter">
  <div class="md-layout-item md-size-100 md-xsmall-size-100">
    <h3><router-link :to="auctionUrl">{{auction.title}}</router-link></h3>
    <p>{{auction.description}}</p>
    <p>{{countdown}}</p>
  </div>
</div>
</template>

<script>
import utils from "@/services/utils";
import moment from "moment";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleAuction",
  components: {},
  props: {
    auction: {
      type: Object,
      default() {
        return {};
      }
    },
    future: false
  },
  methods: {
    convertDate(date) {
      return moment(date).format();
    }
  },
  computed: {
    auctionUrl() {
      return `/online-auction/${this.auction.administrator}/${
        this.auction.auctionId
      }`;
    },
    countdown() {
      let serverTime = this.$store.getters["serverTime"];
      return utils.dt_Offset(serverTime, this.auction.startDate);
    }
  }
};
</script>
