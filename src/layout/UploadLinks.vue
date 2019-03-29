<template>
  <mdb-dropdown>
    <mdb-dropdown-toggle tag="a" navLink color="" slot="toggle"  waves-fixed>
      <span class="hi-link">Upload</span>
    </mdb-dropdown-toggle>

    <mdb-dropdown-menu class="dropdown-menu-right" id="userMainMenu" >

      <mdb-dropdown-item>
        <router-link to="/my-artwork/upload" class="dropdown-item">Upload Artwork</router-link>
      </mdb-dropdown-item>

      <mdb-dropdown-item v-if="featureAuctions">
        <router-link to="/gallery/upload" class="dropdown-item">Gallery Signup</router-link>
      </mdb-dropdown-item>

      <mdb-dropdown-item v-if="featureAuctions">
        <router-link to="/my-auctions/upload" class="dropdown-item">Upload Auction</router-link>
      </mdb-dropdown-item>

    </mdb-dropdown-menu>
  </mdb-dropdown>

</template>

<script>
import { mdbBadge, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbBtn, mdbContainer, mdbCollapse, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';
import myAccountService from "@/services/myAccountService";

export default {
  name: 'AccountLinks',
  components: {
    mdbNavbar,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbBtn,
    mdbContainer,
    mdbDropdown,
    mdbCollapse,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbInput,
    mdbNavbarBrand,
    mdbBadge,
    mdbIcon,
    mdbRow
  },
  data() {
    return {
      showSearch: false,
      query: null
    };
  },
  mounted() {
  },
  computed: {
    showAdmin() {
      return this.$store.state.myAccountStore.myProfile.showAdmin;
    },
    featureAuctions() {
      return this.$store.state.constants.featureAuctions;
    },
    hasInvoices() {
      let invoices = this.$store.getters["invoiceStore/getInvoices"];
      if (!invoices || !invoices.records) {
        return 0;
      }
      return invoices.records.length;
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
    },
    adminUser() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.showAdmin;
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
<style scoped>
.nav-link {
  text-transform: uppercase;
  font-size: 1.3em;
  font-weight: 400;
  text-transform: capitalize;
}
.dropdown-menu {
  min-width: 200px;
  border: none;
  top: 11px;
  border-radius: 0;
  margin-top: -5px;
}

.hi-link {
  color: teal; padding-left: 5px;
}
.show .hi-link {
  color: white;
}
.btn.dropdown-toggle { color: black; }
.dropdown .dropdown-menu .dropdown-item,
.dropdown .dropdown-menu .dropdown-item:hover {
  background: initial;
  box-shadow: none;
  color: initial!important;
}

.dropdown-submenu {
  position:relative;
}

.dropdown-submenu .dropdown-menu {
  top:0;
  left:100%;
}

.dropdown-item {
  font-size: 0.9375rem;
  font-weight: 300;
}

.dropdown-item > a {
  padding: 0;
}

.fa-user-circle { font-size: 1.7rem; padding-bottom: 4px;}

</style>
