<template>
  <mdb-container fluid class="bg-light flex-1 py-5">
    <mdb-row class="">
      <my-single-artwork :artwork="artwork" class="offset-3 col-sm-6" />
    </mdb-row>
  </mdb-container>
</template>

<script>
import MySingleArtwork from "./components/myArtwork/MySingleArtwork";
import { mdbContainer, mdbRow,  mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, mdbCardImage, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtwork",
  bodyClass: "index-page",
  components: {
    MySingleArtwork,
    mdbContainer,
    mdbRow,
    mdbCard,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbCardImage,
    mdbMask,
    mdbIcon,
    mdbView,
    mdbBtn
  },
  data() {
    return {
      artworkId: null
    };
  },
  created() {
    this.artworkId = Number(this.$route.params.artworkId);
    this.$store.dispatch("myArtworksStore/fetchMyArtwork", this.artworkId);
  },
  methods: {},
  computed: {
    artwork() {
      return this.$store.getters["myArtworksStore/myArtwork"](this.artworkId);
    },
  }
};
</script>
