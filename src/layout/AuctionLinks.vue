<template>
  <mdb-dropdown tag="li" class="nav-item">
    <mdb-dropdown-toggle tag="a" class="dropright" navLink color="" slot="toggle" waves-fixed>Artwork</mdb-dropdown-toggle>
    <mdb-dropdown-menu class="dropdown-menu-left">
      <mdb-dropdown-item v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-artworks"
          >My Art Work</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-artwork/upload"
          >Upload Artwork</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/online-auctions"
          >Auctions</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-auctions"
          >My Auctions</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-auctions/upload"
          >New Auction</router-link
        >
      </mdb-dropdown-item>
    </mdb-dropdown-menu>
  </mdb-dropdown>
</template>

<script>
import { mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbContainer, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';

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
  methods: {}
};
</script>
