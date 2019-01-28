<template>
<mdb-container>
  <section class="text-center my-5">
    <h2 class="h1-responsive font-weight-bold my-5">Artists at Transit8</h2>
    <div class="row">
      <single-artist v-for="(artist, index) of artists" :key="index" :artist="artist"/>
    </div>
  </section>
</mdb-container>
</template>

<script>
import SingleArtist from './components/artists/SingleArtist'
import { mdbContainer, mdbRow } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artists',
  components: {
    SingleArtist,
    mdbContainer,
    mdbRow
  },
  data () {
    return {
    }
  },

  mounted () {
  },
  computed: {
    artists () {
      return this.$store.getters['userProfilesStore/getProfiles']
      // return this.$store.getters['artworkSearchStore/getArtistsPage']
    },
  },
  methods: {
    updateFilters (filters) {
      this.filters = filters
    },
    loadMore () {
      //
    }
  }
}
</script>
