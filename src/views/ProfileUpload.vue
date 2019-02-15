<template>
<div class="container-fluid bg-light flex-1">
  <profile-upload-form :formTitle="'Create Your RA Profile'" :mode="'upload'"/>
</div>
</template>

<script>
import ProfileUploadForm from "./components/profile/ProfileUploadForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ProfileUpload",
  bodyClass: "index-page",
  components: {
    ProfileUploadForm,
  },
  data() {
    return {
    };
  },
  mounted() {
    let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
  },
  computed: {},
  methods: {}
};
</script>
