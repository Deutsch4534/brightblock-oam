<template>
  <mdb-card class="bg-transparent mb-4 w-100">
    <router-link class="grid-item" :to="buyNowUrl">
      <mdb-view hover>
      <mdb-card-image :src="artwork.image" :alt="artwork.title"></mdb-card-image>
        <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
      </mdb-view>
    </router-link>
    <mdb-card-body class="px-0">
      <router-link :to="buyNowUrl">
        <mdb-card-title class="h2-responsive subtitle">{{artwork.title}}</mdb-card-title>
      </router-link>
      <mdb-card-text>{{artwork.description}}<br /><span class="small">by: {{artwork.artist}}</span></mdb-card-text>
      <mdb-card-text v-if="debugMode">of: {{artwork.owner}}</mdb-card-text>
      <mdb-card-text><selling-options-for-search :artwork="artwork"/></mdb-card-text>

    </mdb-card-body>
  </mdb-card>
</template>

<script>
import SellingOptionsForSearch from "./SellingOptionsForSearch";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbView, mdbMask } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleResult",
  components: {
    SellingOptionsForSearch,
    mdbCard,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbView,
    mdbMask
  },
  props: {
    artwork: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  computed: {
    debugMode() {
      return this.$store.state.constants.debugMode;
    },
    buyNowUrl() {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`;
    }
  }
};
</script>
<style scoped>
  .subtitle {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  .subtitle,
  .card-body p {
    color: white!important;
  }
</style>

