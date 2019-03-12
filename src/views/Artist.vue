<template>
  <mdb-container fluid class="bg-dark flex-1 py-5">
    <mdb-container class="py-5">
      <mdb-row>
        <single-artist :artist="artist" class="col-sm-12 col-md-4 col-lg-3 mb-3 artist-page"/>
        <div class="col-sm-12 col-md-8 col-lg-9 pl-5 pb-3">
          <h2 class="text-white pb-3">All artworks</h2>
          <div id="artist-all-artworks" class="bg-dark flex-1">
            <div class="row">
              <single-result v-for="(artwork, index) of artworks" :key="index" :artwork="artwork" class="result-item col-sm-6 col-md-6 col-lg-6"/>
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
import SingleResult from "./components/search/SingleResult";
import artworkSearchService from "@/services/artworkSearchService";

// noinspection JSUnusedGlobalSymbols
export default {
  name: 'Artist',
  components: {
    SingleResult,
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
