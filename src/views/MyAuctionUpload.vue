<template>
<div class="container wide">
  <div class="row">
    <h1>Upload an Auction</h1>
    <my-auction-upload-form :mode="'upload'"/>
  </div>
</div>
</template>

<script>
import MyAuctionUploadForm from "./components/auction/MyAuctionUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUpload",
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
