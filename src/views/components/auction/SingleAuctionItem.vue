<template>
<mdb-media tag="li" class="my-4">
  <img class="d-flex mr-3" width="250px" :src="artwork.image" :alt="artwork.title" />
  <mdb-media-body>
    <h5 class="mt-0 mb-1 font-weight-bold">{{artwork.title}}</h5>
    <p>{{artwork.description}}</p>
    <p>By: {{artwork.artist}}</p>
  </mdb-media-body>
</mdb-media>
</template>

<script>
import { mdbMedia, mdbMediaBody } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleAuctionItem",
  components: {
    mdbMedia,
    mdbMediaBody
  },
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
