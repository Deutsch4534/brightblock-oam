<template>
  <router-link :to="artworkUrl" :class="[artworkWidth]" class="col-xs-12 grid-item">
    <img :src="artwork.image" :alt="artwork.title">
    <!-- TO DO: in design, artwork caption is artist name -->
    <p class="art-title">{{artwork.title}}</p>
    <p class="artwork-caption"><description-overflow :text="artwork.description"/></p>
  </router-link>
</template>

<script>
import DescriptionOverflow from "@/views/components/utils/DescriptionOverflow";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'SingleArtwork',
  components: {
    DescriptionOverflow
  },
  props: {
    artwork: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  computed: {
    artworkWidth () {
      return `col-sm-${this.width}`
    },
    artworkUrl () {
      return `/artworks/${this.artwork.id}`
    }
  }
}
</script>
