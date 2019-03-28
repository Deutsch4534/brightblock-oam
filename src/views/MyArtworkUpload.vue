<template>
<div class="container-fluid bg-light flex-1 py-5" v-if="loading">
  <div>Loading artwork - please wait...</div>
</div>
<div class="container-fluid bg-light flex-1 py-5" v-else>
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
      featureMessage: "Get in touch about how to upload artwork.",
      loading: true
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((myProfile) => {
      if (myProfile) {
        if (!myProfile.publicKeyData || !myProfile.publicKeyData.bitcoinAddress) {
          this.$router.push("/profile/update?from=upload-artwork");
        } else {
          this.enabled = true; // myProfile.showAdmin;
        }
      }
      this.loading = false;
    });
  },
  computed: {},
  methods: {}
};
</script>
