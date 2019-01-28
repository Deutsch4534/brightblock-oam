<template>
<div class="container">
  <my-auction-upload-form :auctionId="auctionId" :mode="'update'"/>
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
