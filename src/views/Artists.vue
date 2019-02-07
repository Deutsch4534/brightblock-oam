<template>
  <mdb-container fluid class="bg-light flex-1">
    <mdb-container class="py-5">
      <mdb-row>
        <mdb-col col="12" class="mb-5">
          <h1 class="h1-responsive">Artists</h1>
        </mdb-col>
      </mdb-row>
      <mdb-row>
        <single-artist v-for="(artist, index) of artists" :key="index" :artist="artist" class="col-sm-6 col-md-4 col-lg-3 mb-3 d-flex"/>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import SingleArtist from './components/artists/SingleArtist'
import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artists',
  components: {
    SingleArtist,
    mdbContainer,
    mdbRow,
    mdbCol
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
