<template>
  <mdb-dropdown id="userSubMenu">
    <mdb-dropdown-toggle id="userSubMenuBtn" style="text-transform: none;" slot="toggle" waves-fixed>
      My Portfolio
    </mdb-dropdown-toggle>
    <mdb-dropdown-menu class="dropdown-menu-left dropdown-submenu position-static">
      <li v-if="loggedIn" @click="closeUserMenu">
        <router-link class="dropdown-item" to="/my-artworks">My Artwork</router-link>
      </li>
      <li v-if="loggedIn" v-on:click.self @click="closeUserMenu">
        <router-link class="dropdown-item" to="/my-artwork/upload">Upload Artwork</router-link>
      </li>
      <li v-if="loggedIn && featureAuctions" @click="closeUserMenu">
        <router-link class="dropdown-item" to="/my-auctions">My Auctions</router-link>
      </li>
      <li v-if="loggedIn && featureAuctions" @click="closeUserMenu">
        <router-link class="dropdown-item" to="/my-auctions/upload">New Auction</router-link>
      </li>
    </mdb-dropdown-menu>
  </mdb-dropdown>

</template>

<script>
  import {
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbContainer,
    mdbDropdown,
    mdbCollapse,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbInput,
    mdbNavbarBrand,
    mdbIcon,
    mdbRow
  } from 'mdbvue';

  export default {
    name: 'AccountLinks',
    components: {
      mdbNavbar,
      mdbNavItem,
      mdbNavbarNav,
      mdbNavbarToggler,
      mdbCollapse,
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
      featureAuctions() {
        return this.$store.state.constants.featureAuctions;
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
     closeUserMenu(){
        let mainMenu = document.getElementById('userMainMenu');
        let mainMenuBtn = document.getElementById('userMainMenuBtn');
        if(mainMenu.classList.contains('show')) {
          mainMenuBtn.click();
        }
      }
    },
    mounted(){
      let subMenu = document.getElementById('userSubMenu');
      subMenu.addEventListener("click", function(e) {
        e.stopPropagation();
      });
    }
  };
</script>

<style scoped>
  .dropdown-menu {
    position: static !important;
    background: transparent;
    border: none;
  }

  #userSubMenuBtn {
    padding: 8px;
    color: inherit;
    font-size: 0.9375rem;
    font-weight: 300;
  }

  .dropdown .dropdown-menu .dropdown-item,
  .dropdown .dropdown-menu .dropdown-item:hover,
  .dropdown .dropdown-menu .dropdown-item:focus,
  .dropdown .dropdown-menu .dropdown-item:active,
  .dropdown .dropdown-menu .dropdown-item.router-link-active {
    background-color: inherit;
    box-shadow: none;
    color: inherit !important;
  }

  .dropdown-submenu {
    padding-top:0;
    padding-bottom: 0;
  }

  .dropdown-submenu a {
    padding-left: 0;
    padding-right: 0;
  }

  @media (max-width: 576px) {
    .dropdown .dropdown-menu .dropdown-item {
      font-size: 1.2rem;
    }
  }
</style>
