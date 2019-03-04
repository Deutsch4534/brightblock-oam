<template>
<div class="container-fluid bg-light flex-1">
  <auxiliary-profile-form :formTitle="'RA Profile'" :mode="'upload'" class="form-transparent"/>
</div>
</template>

<script>
import AuxiliaryProfileForm from "./components/profile/AuxiliaryProfileForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ProfileUpload",
  bodyClass: "index-page",
  components: {
    AuxiliaryProfileForm,
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
