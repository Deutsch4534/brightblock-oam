<template>
<div class="md-layout md-gutter">
  <div class="md-layout-item md-size-25 md-xsmall-size-100">
    <router-link :to="url"><img :src="artwork.image" :alt="artwork.title"></router-link>
  </div>
  <div class="md-layout-item md-size-50 md-xsmall-size-100">
    <h5 class="mt-0 mb-1">{{artwork.title}}</h5>
    <p class="artwork-caption">{{artwork.description}}</p>
    <p class="artwork-caption">Artist: {{artwork.artist}}</p>
  </div>
  <div class="md-layout-item md-size-25 md-xsmall-size-100">
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
      return process.env.VUE_APP_DEBUG_MODE;
    },
    url() {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`;
    }
  }
};
</script>
<style scoped>
.md-layout-item {
  margin-bottom: 20px;
}
</style>
