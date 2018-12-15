<template>
<div class="wrapper">
  <leafs/>
  <div class="main main-raised">
    <div class="section section-basic">
      <div class="container">
        <my-artwork-upload-form :formTitle="'Upload Artwork'"/>
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
  name: "MyArtworkUpload",
  bodyClass: "index-page",
  components: {
    MyArtworkUploadForm,
    Leafs
  },
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {}
};
</script>
