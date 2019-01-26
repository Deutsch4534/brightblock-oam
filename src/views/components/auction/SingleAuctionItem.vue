<template>
<div class="row">
  <div class="col-md-4 md-xsmall-size-100">
    <img :src="artwork.image" :alt="artwork.title">
  </div>
  <div class="col-md-8 md-xsmall-size-100">
    <h4 class="media-heading">{{artwork.title}}</h4>
    {{artwork.description}}
  </div>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleAuctionItem",
  components: {},
  props: {
    auctionId: null,
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {},
  computed: {
    artwork() {
      return this.$store.getters["artworkSearchStore/getArtwork"](
        this.item.itemId
      );
    }
  }
};
</script>
