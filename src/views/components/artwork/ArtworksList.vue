<template>
  <div>
    <div class="grid innerpage-artworks mt-50">
      <div class="grid-sizer"></div>
      <div class="row" v-for="(chunkedArtwork, index) of chunkedArtworks" :key="index">
        <single-artwork v-for="(artwork, index) of chunkedArtwork" :key="index" :artwork="artwork"/>
      </div>
    </div>
    <div class="hr-spacer"></div>
  </div>
</template>

<script>
import chunk from 'lodash/chunk'
import SingleArtwork from './SingleArtwork'

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'ArtworksList',
  components: { SingleArtwork },
  props: {
    artworks: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    loadMore () {
      this.$emit('load-more')
    }
  },
  computed: {
  }
}
</script>
