<template>
<!--
  <li class="nav-item avatar dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink-55" data-toggle="dropdown" aria-haspopup="true"
      aria-expanded="false">
      <img :src="avatarUrl" class="rounded-circle z-depth-0" alt="avatar image">
    </a>
    <div class="dropdown-menu dropdown-menu-right dropdown-secondary" aria-labelledby="navbarDropdownMenuLink-55">
        <a class="dropdown-item">{{ username }}</a>
        <router-link
          class="dropdown-item"
          to="/admin/registrations"
          v-if="showAdmin"
          >Admin</router-link
        >
    </div>
  </li>
  -->
  <mdb-dropdown tag="li" class="nav-item">
    <mdb-dropdown-toggle tag="a" class="dropleft" navLink color="" slot="toggle" waves-fixed v-html="avatar"></mdb-dropdown-toggle>
    <mdb-dropdown-menu class="dropdown-menu-right">
      <mdb-dropdown-item>
        <a class="dropdown-item">{{ username }}</a>
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
          to="/my-artworks"
          >My Art Work</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item>
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
          >Online Auctions</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/my-auctions"
          >My Auctions</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/my-auctions/upload"
          >New Auction</router-link
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
    doSearch() {
      if (!this.query) {
        this.query = "*";
      }
      this.$router.push("/search?query=" + this.query);
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      myAccountService.logout();
    }
  }
};
</script>
