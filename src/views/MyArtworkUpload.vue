<template>
<div class="container-fluid bg-light flex-1 py-5">
  <my-artwork-upload-form :formTitle="'Upload Artwork'" :mode="'upload'"/>
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
    return {
      enabled: false
    };
  },
  mounted() {},
  computed: {},
  methods: {}
};
</script>
