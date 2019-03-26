<template>
<mdb-container fluid class="bg-light flex-1 pt-5">
  <div v-if="loading">Loading artwork - please wait...</div>
  <my-artwork-manage :artwork="artwork" v-else/>
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
      artwork: null,
      loading: true
    };
  },
  created() {
    let artworkId = Number(this.$route.params.artworkId);
    this.$store.dispatch("myArtworksStore/fetchMyArtwork", artworkId).then((artwork) => {
      this.loading = false;
      this.artwork = artwork;
    });
  },
  methods: {},
};
</script>
