<template>
  <mdb-dropdown tag="li" class="nav-item">
    <mdb-dropdown-toggle tag="a" class="user-menu dropleft pr-1" navLink color="stylish" slot="toggle" waves-fixed>
      <img style="width: 40px; height: 40px; border-radius: 20px;" :src="avatarUrl"/>
    </mdb-dropdown-toggle>
    <mdb-dropdown-menu class="dropdown-menu-right">
      <mdb-dropdown-item>
        <a class="dropdown-item">{{ username }}</a>
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/profile/update"
          >Profile</router-link
        >
      </mdb-dropdown-item>
      <mdb-dropdown-item v-if="hasInvoices">
        <router-link class="dropdown-item" to="/invoices">
          Invoices <mdb-badge color="danger-color" class="ml-2">{{hasInvoices}}</mdb-badge>
          <span class="sr-only">invoices</span>
        </router-link>
      </mdb-dropdown-item>
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/admin/settings"
          v-if="showAdmin"
          >Admin</router-link
        >
      </mdb-dropdown-item>
      <!--
      <mdb-dropdown-item>
        <router-link
          class="dropdown-item"
          to="/account/userData"
          >My Account</router-link
        >
      </mdb-dropdown-item>
      -->
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
import { mdbBadge, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbContainer, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';
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
  computed: {
    showAdmin() {
      return this.$store.state.myAccountStore.myProfile.showAdmin;
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
  .dropdown .dropdown-menu .dropdown-item:hover {
    background: initial;
    box-shadow: none;
    color: initial!important;
  }

  .fa-user-circle { font-size: 1.7rem; }
</style>
