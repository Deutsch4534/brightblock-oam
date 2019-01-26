<template>
<mdb-container>
  <!-- modal trigger button -->
  <mdb-modal v-if="login" @close="closeLogin">
  <!-- simple login modal  -->

    <mdb-modal-header class="text-center">
      <mdb-modal-title tag="h4" bold class="w-100">Sign in</mdb-modal-title>
    </mdb-modal-header>
    <mdb-modal-body class="mx-3 grey-text">
    <!--
      <mdb-input label="Your email" icon="envelope" type="email" class="mb-5" v-modal="email"/>
      <mdb-input label="Your password" icon="lock" type="password" v-model="password"/>
    -->
    </mdb-modal-body>
    <mdb-modal-footer center>
      <mdb-btn v-on:click="loginMultiPlayer">Login</mdb-btn>
    </mdb-modal-footer>
  </mdb-modal>
</mdb-container>
</template>

<script>
import { mdbContainer, mdbBtn, mdbModal, mdbModalHeader, mdbModalBody, mdbModalTitle, mdbModalFooter } from 'mdbvue';
import myAccountService from "@/services/myAccountService";

export default {
  bodyClass: "login-page",
  components: {
    mdbContainer,
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter,
    mdbModalTitle
  },
  data() {
    return {
      firstname: null,
      email: null,
      password: null,
      login: true
    };
  },
  props: {
    header: {
      type: String,
      default: require("@/assets/img/profile_city.jpg")
    }
  },
  mounted() {
    if (myAccountService.isLoggedIn()) {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    loginMultiPlayer: function () {
      let res = myAccountService.loginMultiPlayer();
      this.$router.push({ path: "/" });
      return res;
    },
    closeLogin: function () {
      this.$router.push({ path: "/" });
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  }
};
</script>

<style></style>
