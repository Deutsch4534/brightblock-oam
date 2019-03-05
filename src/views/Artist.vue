<template>
  <mdb-container fluid class="bg-light flex-1">
    <mdb-container class="py-5">
      <mdb-row>
        <single-artist :artist="artist" class="col-sm-12 col-md-4 col-lg-3 mb-3 artist-page"/>
        <div class="col-sm-12 col-md-8 col-lg-9">
          <h2 class="h3-responsive mb-5">All artworks</h2>
          <div id="artist-all-artworks" class="bg-dark flex-1 p-5 m-3">
            <div class="row">
              <gallery-artwork v-for="(artwork, index) in artworks" :key="index" :artwork="artwork" class="gallery-item col-sm-6 col-md-6 col-lg-6"/>
            </div>
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
import GalleryArtwork from "./components/gallery/GalleryArtwork";
import artworkSearchService from "@/services/artworkSearchService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artist',
  components: {
    GalleryArtwork,
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
    if (this.$store.state.constants.featureBitcoin) {
      artworkSearchService.newQuery({field: "artist", query: this.username});
    }
  },
  mounted () {
  },
  computed: {
    artist () {
      let profile = this.$store.getters['userProfilesStore/getProfile'](this.username);
      if (!profile) {
        profile = {};
      }
      if (!profile.avatarUrl) {
        profile.avatarUrl = require("@/assets/img/faces/avatar.jpg");
      }
      return profile;
    },
    artworks () {
      return this.$store.getters['artworkSearchStore/getArtworksByArtist'](this.username);
    },
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
