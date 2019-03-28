<template>
<mdb-container fluid class="bg-light flex-1 px-5">
  <mdb-container class="bg-white mt-5 p-3" v-if="loading">
    <div>Loading user profile - please wait...</div>
  </mdb-container>
  <mdb-container class="mt-5" v-else>
    <auxiliary-profile-form :formTitle="'RA Profile'" :mode="'update'"/>
  </mdb-container>
</mdb-container>
</template>

<script>
import AuxiliaryProfileForm from "./components/profile/AuxiliaryProfileForm";
import { mdbContainer } from "mdbvue";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ProfileUpdate",
  bodyClass: "index-page",
  components: {
    AuxiliaryProfileForm, mdbContainer
  },
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    this.$store.dispatch("myAccountStore/fetchMyAccount").then((profile) => {
      this.loading = false;
    });
  },
  computed: {},
  methods: {}
};
</script>
