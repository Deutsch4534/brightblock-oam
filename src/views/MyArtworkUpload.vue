<template>
<div class="container">
  <my-artwork-upload-form :formTitle="'Upload Artwork'"/>
</div>
</template>

<script>
import MyArtworkUploadForm from "./components/myArtwork/MyArtworkUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUpload",
  bodyClass: "index-page",
  components: {
    MyArtworkUploadForm
  },
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {}
};
</script>
