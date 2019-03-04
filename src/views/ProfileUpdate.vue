<template>
<div class="container-fluid bg-light flex-1">
  <auxiliary-profile-form :formTitle="'RA Profile'" :mode="'update'"/>
</div>
</template>

<script>
import AuxiliaryProfileForm from "./components/profile/AuxiliaryProfileForm";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ProfileUpdate",
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
