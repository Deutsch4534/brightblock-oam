<template>
  <mdb-dropdown tag="li" class="nav-item">
    <mdb-dropdown-toggle tag="a" class="dropright" color="" navLink slot="toggle" waves-fixed>My Portfolio</mdb-dropdown-toggle>
    <mdb-dropdown-menu class="dropdown-menu-left position-static">
      <li v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-artworks"
          >My Art Work</router-link
        >
      </li>
      <li v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-artwork/upload"
          >Upload Artwork</router-link>
      </li>
      <li v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-auctions"
          >My Auctions</router-link
        >
      </li>
      <li v-if="loggedIn">
        <router-link
          class="dropdown-item"
          to="/my-auctions/upload"
          >New Auction</router-link
        >
      </li>
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

<style scoped>
 .dropdown-menu {
    position: static!important;
    background: transparent;
    border:none;
  }
  .dropdown .dropdown-menu .dropdown-item {
    color: white;
    font-size: 2rem;
    padding: 0.7rem 0.7rem 0.7rem 1.5rem;
  }
 .dropdown .dropdown-menu .dropdown-item:hover,
 .dropdown .dropdown-menu .dropdown-item:focus,
 .dropdown .dropdown-menu .dropdown-item:active {
   background-color: inherit;
   box-shadow: none;
   color: rgba(255, 255, 255, 0.75)!important;
 }

  @media (max-width: 576px) {
    .dropdown .dropdown-menu .dropdown-item {
      font-size: 1.2rem;
      padding: 0.5rem 0.5rem 0.5rem 1rem;
    }
  }
</style>
