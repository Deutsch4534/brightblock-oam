<template>
<mdb-container fluid class=" flex-1 pt-5">
  <mdb-container class="bg-white mt-5 p-3" v-if="loading">
    <div>Loading artwork - please wait...</div>
  </mdb-container>
  <my-artwork-manage :artwork="artwork" :myProfile="myProfile" @reload="reload" v-else/>
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
      myProfile: {},
      loading: true
    };
  },
  created() {
    let artworkId = Number(this.$route.params.artworkId);
    this.$store.dispatch("myArtworksStore/fetchMyArtwork", artworkId).then((artwork) => {
      if (!artwork.image) {
        artwork.image = require("@/assets/img/logo/logo-black-256x256.png");
      }
      this.artwork = artwork;
      this.$store.dispatch("myAccountStore/fetchMyAccount").then(myProfile => {
        this.myProfile = myProfile;
        this.loading = false;
      });
    });
  },
  methods: {
    reload: function() {
      this.artwork = this.$store.getters["myArtworksStore/myArtwork"](this.artwork.id);
    }
  },
};
</script>
