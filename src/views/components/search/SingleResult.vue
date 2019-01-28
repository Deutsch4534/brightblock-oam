<template>
<mdb-media tag="li" class="my-4">
  <router-link class="text-white" :to="buyNowUrl"><img class="d-flex mr-3" width="250px" :src="artwork.image" :alt="artwork.title" /></router-link>
  <mdb-media-body>
    <h5 class="mt-0 mb-1 font-weight-bold">{{artwork.title}}</h5>
    <p>{{artwork.description}}</p>
    <p>By: {{artwork.artist}}</p>
    <p v-if="debugMode">Of: {{artwork.owner}}</p>
    <p><selling-options-for-search :artwork="artwork"/></p>
  </mdb-media-body>
</mdb-media>
</template>

<script>
import SellingOptionsForSearch from "./SellingOptionsForSearch";
import { mdbMedia, mdbMediaImage, mdbMediaBody, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleResult",
  components: {
    SellingOptionsForSearch,
    mdbMedia,
    mdbMediaImage,
    mdbMediaBody,
    mdbBtn
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
</style>
