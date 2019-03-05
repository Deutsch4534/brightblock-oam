<template>
<div class="container-fluid bg-light flex-1 py-5">
  <my-artwork-upload-form v-if="enabled" :formTitle="'Upload Artwork'" :mode="'upload'"/>
  <contact-section :featureMessage="featureMessage" v-else class="black-text"/>
</div>
</template>

<script>
import MyArtworkUploadForm from "./components/myArtwork/MyArtworkUploadForm";
import ContactSection from "./components/splash/ContactSection";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyArtworkUpload",
  bodyClass: "index-page",
  components: {
    MyArtworkUploadForm,
    ContactSection
  },
  data() {
    return {
      enabled: false,
      featureMessage: "Get in touch about how to upload artwork."
    };
  },
  mounted() {
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
    if (myProfile) {
      if (!myProfile.publicKeyData || !myProfile.publicKeyData.bitcoinAddress) {
        this.$router.push("/profile/upload?from=upload-artwork");
      } else {
        this.enabled = myProfile.showAdmin;
      }
    }
  },
  computed: {},
  methods: {}
};
</script>
