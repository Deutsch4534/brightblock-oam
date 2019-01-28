<template>
<mdb-container>
  <section class="text-center my-5">
    <div class="row">
      <single-artist :artist="artist"/>
    </div>
    <div class="row my-4">
      <div class="col-sm-12">
        <h2 class="h4 mb-50">All artworks by {{artist.name}}</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12" id="artist-all-artworks">
        <last-artworks :artworks="artworks" class=""/>
      </div>
    </div>
  </section>
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
