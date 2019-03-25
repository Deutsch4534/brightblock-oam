<template>
<mdb-container fluid class="bg-light flex-1 pt-5">
  <my-artwork-manage :artwork="artwork" />
</mdb-container>
</template>

<script>
import MyArtworkManage from "./components/myArtwork/MyArtworkManage";
import { mdbContainer, mdbRow,  mdbCard, mdbCardBody, mdbCardTitle, mdbCardText, mdbCardImage, mdbMask, mdbIcon, mdbView, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtwork",
  bodyClass: "index-page",
  components: {
    MyArtworkManage,
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
