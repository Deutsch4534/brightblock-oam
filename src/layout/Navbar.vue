<template>
<!-- Main navigation 424f95 -->
<header>
<nav class="navbar navbar-expand-lg">

  <!-- mdbNavbar brand -->
  <span class="d-inline-block mr-3">
    <router-link to="/" class="navbar-brand d-inline-block" ><img :src="logo" height="20px" alt="radicle logo"></router-link>
  </span>
  <button @click.prevent="toggleNav" class="navbar-toggler toggler-example black darken-3" type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="white-text"><i class="fas fa-bars fa-1x"></i></span>
  </button>

  <div class="collapse navbar-collapse" :class="toggleClass" id="navbarSupportedContent">
    <!--  <span class="dark-blue-text"><i class="fas fa-bars fa-1x"></i></span> -->
    <form class="md-form search-form ml-2" @submit.prevent="">
      <a type="button" @click.prevent="doSearch"><mdb-icon class="" icon="search" /></a>
      <input label="Search" type="text" class="mt-0 mb-0 ml-1" v-model="query" placeholder="Search" aria-label="Search" v-on:keyup.13="doSearch"/>
    </form>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/gallery">Gallery</router-link></li>
      <li class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/artists">Artists</router-link></li>
      <li v-if="featureAuctions" class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/online-auctions">Auctions</router-link></li>
      <li v-if="loggedIn" class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/my-artworks">My Artwork</router-link></li>
      <upload-links v-if="loggedIn"/>
      <li v-if="loggedIn && hasInvoices" class="nav-item" @click="closeMenu"><router-link class="nav-link navbar-link" to="/orders"><i class="fas fa-shopping-bag"></i><sup><mdb-badge color="danger-color" class="ml-2">{{hasInvoices}}</mdb-badge></sup></router-link></li>
      <account-links v-if="loggedIn"/>
      <li class="nav-item" @click="closeMenu"><router-link v-if="!loggedIn" class="nav-link navbar-link" to="/login">Login</router-link></li>
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
      // logo: require("@/assets/img/logo/logo-black-256x256.png"),
      logo: require("@/assets/img/logo/Radicle_logo-test.png")
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
  box-shadow: none;
  min-height: 60px;
}
.navbar-link {
  text-transform: uppercase;
  font-size: 0.8em;
}
.navbar-toggler-icon {
  background-color: blue;
}
.show {
  background-color: black;
  border: 1pt solid white;
  color: white;
  font-weight: bold;
  z-index: 10;
  margin: 10px;
  padding: 10px 0 10px 30px;

}

.navbar .md-form {
  margin: 0;
}

i.fa-search {
  color: gray;
  transform: rotate(90deg);
  font-size: 14px;
}
.search-form input, .login-link, .nav-cta { font-size: 16px; font-weight: normal; }
.search-form input { border-bottom: none; }
.search-form input:focus { box-shadow: none!important; border-bottom: 1pt solid gray!important; }

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
