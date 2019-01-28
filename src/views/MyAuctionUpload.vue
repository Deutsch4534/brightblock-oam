<template>
<div class="container">
  <my-auction-upload-form :mode="'upload'"/>
</div>
</template>

<script>
import MyAuctionUploadForm from "./components/auction/MyAuctionUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUpload",
  bodyClass: "index-page",
  components: {
    MyAuctionUploadForm
  },
  data() {
    return {};
  },
  created() {},
  computed: {},
  methods: {}
};
</script>
