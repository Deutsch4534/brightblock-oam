<template>
<div class="container">
  <my-artwork-upload-form :artworkId="artworkId" :mode="'update'" :formTitle="'Update Artwork'"/>
</div>
</template>

<script>
import MyArtworkUploadForm from "./components/myArtwork/MyArtworkUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUpdate",
  bodyClass: "index-page",
  components: {
    MyArtworkUploadForm
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
