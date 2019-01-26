<template>
<div class="row mb-4">
  <div class="col-md-4 md-xsmall-size-100">
    <router-link :to="url"><img :src="artwork.image" :alt="artwork.title"></router-link>
  </div>
  <div class="col-md-6 md-xsmall-size-100">
    <h5 class="mt-0 mb-1">{{artwork.title}}</h5>
    <p class="artwork-caption">{{artwork.description}}</p>
    <p class="artwork-caption">Artist: {{artwork.artist}}</p>
  </div>
  <div class="col-md-4 md-xsmall-size-100">
    <selling-options :artwork="artwork"/>
  </div>
</div>
</template>

<script>
import SellingOptions from "../myArtwork/SellingOptions";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleResult",
  components: { SellingOptions },
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
    url() {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`;
    }
  }
};
</script>
<style scoped>
</style>
