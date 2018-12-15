<template>
<div class="wrapper">
  <leafs/>
  <div class="main main-raised">
    <div class="section section-basic">
      <div class="container">
        <my-artwork-upload-form :artworkId="artworkId" :mode="'update'" :formTitle="'Update Artwork'"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import MyArtworkUploadForm from "./components/myArtwork/MyArtworkUploadForm";
import Leafs from "./components/Leafs";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUpdate",
  bodyClass: "index-page",
  components: {
    MyArtworkUploadForm,
    Leafs
  },
  data() {
    return {};
  },
  created() {
    this.artworkId = Number(this.$route.params.artworkId);
  },
  computed: {},
  methods: {}
};
</script>
