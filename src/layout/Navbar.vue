<template>
<!-- Main navigation 424f95 -->
<header>
<nav class="navbar navbar-expand-lg">

  <!-- mdbNavbar brand -->
  <form class="md-form search-form">
    <a type="button" @click="doSearch"><mdb-icon class="mb-0 mr-2" icon="search" /></a>
    <input label="Search" type="text" class="mt-0 mb-0" v-model="query" placeholder="Search" aria-label="Search" v-on:keyup.13="doSearch"/>
  </form>
  <button @click.prevent="toggleNav" class="navbar-toggler toggler-example black darken-3" type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="white-text"><i class="fas fa-bars fa-1x"></i></span>
  </button>

  <div class="collapse navbar-collapse text-right" :class="toggleClass" id="navbarSupportedContent">
  <!--  <span class="dark-blue-text"><i class="fas fa-bars fa-1x"></i></span> -->
    <ul class="navbar-nav ml-auto">
      <li class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/gallery">Gallery</router-link></li>
      <li class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/artists">Artists</router-link></li>
      <li class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/online-auctions">Auctions</router-link></li>
      <li class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/my-artworks">My Artwork</router-link></li>
      <upload-links v-if="loggedIn"/>
      <account-links v-if="loggedIn"/>
      <li class="nav-item" @click="closeMenu"><router-link v-if="!loggedIn" class="btn nav-link navbar-link px-3" to="/login">Login</router-link></li>
    </ul>
  </div>

</nav>
<!-- Main navigation -->
</header>
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
      toggleClass: '',
      logo: require("@/assets/img/logo/logo-black-256x256.png"),
    };
  },
  components: {
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
    closeMenu() {
      this.toggleClass = "";
    },
    toggleNav() {
      if (this.toggleClass === "show") {
        this.toggleClass = "";
      } else {
        this.toggleClass = "show";
      }
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
  min-height: 55px;
}
.navbar-link {
  text-transform: uppercase;
  font-size: 0.8em;
}
.navbar-toggler-icon {
  background-color: blue;
}
.show {
  background-color: #ccc;
  z-index: 10;
  padding: 30px;
  padding-left: 90px;
}

.navbar .md-form {
  margin: 0;
}

i.fa-search {
  color: black;
  transform: rotate(90deg);
  font-size: 24px;
}
.search-form input, .login-link, .nav-cta { font-size: 20px; font-weight: normal; }
.search-form input { border-bottom: none; }
.search-form input:focus { box-shadow: none!important; border-bottom: 1pt solid black!important; }

.search-form input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: grey;
  font-size: 0.7em;
  text-transform: uppercase;
}
.search-form input::-moz-placeholder { /* Firefox 19+ */
  color: grey;
  font-size: 0.7em;
  text-transform: uppercase;
}
.search-form input:-ms-input-placeholder { /* IE 10+ */
  color: grey;
  font-size: 0.7em;
  text-transform: uppercase;
}
.search-form input:-moz-placeholder { /* Firefox 18- */
  color: grey;
  font-size: 0.7em;
  text-transform: uppercase;
}
.search-form button.transparent { border: none; background: transparent; color: black; }

</style>
