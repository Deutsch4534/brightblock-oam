<template>
<div class="container-fluid bg-light flex-1 py-5">
  <gallery-profile-form v-if="enabled" :myProfile="myProfile" :formTitle="'Radicle Galleries'"/>
  <contact-section :featureMessage="featureMessage" v-else class="black-text"/>
</div>
</template>

<script>
import GalleryProfileForm from "./components/gallery/GalleryProfileForm";
import ContactSection from "./components/splash/ContactSection";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "GalleryUpload",
  bodyClass: "index-page",
  components: {
    GalleryProfileForm,
    ContactSection
  },
  data() {
    return {
      myProfile: null,
      enabled: false,
      featureMessage: "Get in touch about how to start a gallery on Radicle."
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
      if (!profile.galleryProfile) {
        profile.gallery = {};
        profile.gallery.name = "my gallery";
      }
      this.myProfile = profile;
      this.enabled = true;
    });
  },
  computed: {},
  methods: {}
};
</script>
