<template>
<div class="container">
  <div class="row">
    <h1>Update Auction</h1>
    <my-auction-upload-form :auctionId="auctionId" :mode="'update'"/>
  </div>
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
  created() {
    this.auctionId = Number(this.$route.params.auctionId);
  },
  computed: {},
  methods: {}
};
</script>
