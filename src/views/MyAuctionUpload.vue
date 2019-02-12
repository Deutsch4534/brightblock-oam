<template>
<div class="container-fluid bg-light flex-1">
  <my-auction-upload-form v-if="enabled" :mode="'upload'"/>
  <contact-section :featureMessage="featureMessage" v-else class="black-text"/>
</div>
</template>

<script>
import MyAuctionUploadForm from "./components/auction/MyAuctionUploadForm";
import ContactSection from "./components/splash/ContactSection";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyAuctionUpload",
  bodyClass: "index-page",
  components: {
    MyAuctionUploadForm,
    ContactSection
  },
  data() {
    return {
      enabled: false,
      featureMessage: "Get in touch about running auctions on T8"
    };
  },
  created() {
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    this.enabled = myProfile.showAdmin;
  },
  computed: {},
  methods: {}
};
</script>
