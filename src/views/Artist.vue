<template>
  <mdb-container fluid class="bg-light flex-1">
    <mdb-container class="py-5">
      <mdb-row>
        <single-artist :artist="artist" class="col-sm-12 col-md-4 col-lg-3 mb-3 artist-page"/>
        <div class="col-sm-12 col-md-8 col-lg-9">
          <h2 class="h3-responsive mb-5">All artworks</h2>
          <div id="artist-all-artworks">
            <last-artworks :artworks="artworks"/>
          </div>
        </div>
      </mdb-row>
    </mdb-container>
  </mdb-container>
</template>

<script>
import ArtistDetails from './components/artists/ArtistDetails'
import SingleArtwork from './components/artwork/SingleArtwork'
import ArtworksList from './components/artwork/ArtworksList'
import { mdbContainer, mdbRow } from 'mdbvue';
import SingleArtist from './components/artists/SingleArtist'
import LastArtworks from "./components/home/LastArtworks";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artist',
  components: {
    LastArtworks,
    ArtworksList,
    SingleArtwork,
    SingleArtist,
    ArtistDetails,
    mdbContainer,
    mdbRow,
  },
  data () {
    return {
    }
  },
  created () {
    this.username = this.$route.params.artistId
  },
  mounted () {
  },
  computed: {
    artist () {
      return this.$store.getters['userProfilesStore/getProfile'](this.username)
    },
    artworks () {
      return this.$store.getters['artworkSearchStore/getArtworksByArtist'](this.username)
    },
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
