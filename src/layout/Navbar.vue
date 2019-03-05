<template>
<!-- Main navigation 424f95 -->
<header>
  <!-- Navbar -->
  <mdb-navbar>

    <!-- mdbNavbar brand -->
    <mdb-navbar-brand>
      <form class="md-form search-form">
        <a type="button" @click="doSearch"><mdb-icon class="mb-0 mr-2" icon="search" /></a>
        <input label="Search" type="text" class="mt-0 mb-0" v-model="query" placeholder="Search" aria-label="Search" v-on:keyup.13="doSearch"/>
      </form>
    </mdb-navbar-brand>
    <mdb-navbar-toggler>
      <mdb-navbar-nav right>

        <router-link class="btn nav-link navbar-link px-3" to="/gallery">Gallery</router-link>
        <router-link class="btn nav-link navbar-link px-3" to="/artists">Artists</router-link>
        <router-link class="btn nav-link navbar-link px-3" to="/online-auctions">Auctions</router-link>

        <upload-links v-if="loggedIn"/>

        <mdb-nav-item v-if="!loggedIn">
          <router-link to="/login">Login</router-link>
        </mdb-nav-item>

        <account-links v-if="loggedIn"/>

      </mdb-navbar-nav>
    </mdb-navbar-toggler>

  </mdb-navbar>
  <!--/.Navbar-->
</header>
<!-- Main navigation -->
</template>

<script>
let resizeTimeout;
function resizeThrottler(actualResizeHandler) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      actualResizeHandler();

      // The actualResizeHandler will execute at a rate of 15fps
    }, 66);
  }
}

import { mdbBadge, mdbContainer, mdbIcon, mdbRow, mdbCol, mdbNavbar, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbInput, mdbBtn, mdbNavbarBrand } from 'mdbvue';
import AccountLinks from "@/layout/AccountLinks";
import UploadLinks from "@/layout/UploadLinks";
import artworkSearchService from "@/services/artworkSearchService";
import myAccountService from '../services/myAccountService';
import SplashLinks from './SplashLinks';

export default {
  name: 'Navbar',
  data() {
    return {
      query: '',
      link1: "team",
      link2: "mission",
      link3: "contact",
      link4: "donate",
      title: "title",
      taglink2: '',
      logo: require("@/assets/img/logo/logo-black-256x256.png"),
      splashLinks: Boolean
    };
  },
  components: {
    SplashLinks,
    UploadLinks,
    AccountLinks,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbNavbar,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbNavItem,
    mdbInput,
    mdbBtn,
    mdbBadge,
    mdbIcon,
    mdbNavbarBrand
  },
  created() {
    this.getContent();
  },
  computed: {
    featureAuctions() {
      return this.$store.state.constants.featureAuctions;
    },
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    },
    hasInvoices() {
      let invoices = this.$store.getters["invoiceStore/getInvoices"];
      if (!invoices || !invoices.records) {
        return 0;
      }
      return invoices.records.length;
    }
  },
  methods: {
    getContent() {
      this.$prismic.client.getSingle("navbar").then(document => {
        this.link1 = document.data.link1[0].text;
        this.link2 = document.data.link2[0].text;
        this.link3 = document.data.link3[0].text;
        this.link4 = document.data.link4[0].text;
        this.title = document.data.title[0].text;
        this.taglink2 = document.data.taglink2[0].text;
      });
    },
    doSearch() {
      let qString = this.query;
      if (!this.query || this.query.length === 0) {
        qString = "*";
      }
      artworkSearchService.newQuery({field: "title", query: qString});
      this.$router.push("/search?query=" + qString);
    },
    scrollListener() {
      resizeThrottler(this.handleScroll);
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      myAccountService.logout();
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
  watch: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  border-bottom: 1px solid lightgray;
  box-shadow: none;
  max-height: 54px;
  flex-wrap: nowrap;
  background: white;
  color: black;
}
.navbar-link {
  text-transform: uppercase;
  font-size: 0.8em;
  margin: 0;
}
</style>
