<template>
  <mdb-dropdown tag="li" class="nav-item">
    <mdb-dropdown-toggle tag="a" class="dropleft" navLink color="" slot="toggle" waves-fixed v-html="avatar"></mdb-dropdown-toggle>
    <mdb-dropdown-menu class="dropdown-menu-right">
      <mdb-dropdown-item>
        <a class="dropdown-item"><mdb-icon fab icon="500px" /> {{ username }}</a>
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/admin/registrations"
          v-if="showAdmin"
          >Admin</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/account/userData"
          >My Account</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <a
          href="#"
          class="dropdown-item"
          @click.prevent="logout"
          >
          <mdb-icon icon="fingerprint"/>
          Logout</a
        >
      </mdb-dropdown-item>
    </mdb-dropdown-menu>
  </mdb-dropdown>
</template>

<script>
import { mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbContainer, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';
import myAccountService from "@/services/myAccountService";

export default {
  name: 'AccountLinks',
  components: {
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbContainer,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbInput,
    mdbNavbarBrand,
    mdbIcon,
    mdbRow
  },
  data() {
    return {
      showSearch: false,
      query: null
    };
  },
  computed: {
    showAdmin() {
      return this.$store.state.myAccountStore.myProfile.showAdmin;
    },
    username() {
      return this.$store.state.myAccountStore.myProfile.name;
    },
    avatar() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      if (myProfile.loggedIn) {
        return (
          '<img style="width: 40px; height: 40px; border-radius: 20px;" src="' +
          myProfile.avatarUrl +
          '"/>'
        );
      } else {
        return '<span class="icon-user"></span>';
      }
    },
    avatarUrl() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.avatarUrl;
    },
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      myAccountService.logout();
      this.$router.push("/");
    }
  }
};
</script>
