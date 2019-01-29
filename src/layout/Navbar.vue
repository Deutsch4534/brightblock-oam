<template>
<!-- Main navigation 424f95 -->
<header>
<mdb-navbar :color="'stylish'" position="top" dark href="#" scrolling>
  <!-- mdbNavbar brand -->
  <mdb-navbar-brand>
    <!-- <router-link to="/" name="sectionUrl(link1 + 'Section')" class="navbar-brand"><img :src="logo" height="50" alt=""></router-link> -->
  </mdb-navbar-brand>
  <mdb-navbar-toggler>
    <mdb-navbar-nav mx-auto>
      <li class="nav-item ripple-parent"><router-link to="/home" class="nav-link navbar-link">Gallery</router-link></li>
      <li class="nav-item ripple-parent"><router-link to="/artists" class="nav-link navbar-link">Artists</router-link/></li>
      <li class="nav-item ripple-parent"><router-link to="/online-auctions" class="nav-link navbar-link">Auctions</router-link/></li>
      <auction-links/>
    </mdb-navbar-nav>
    <mdb-navbar-nav right>
      <form class="form-inline">
        <mdb-input label="Search" type="text" class="active-pink active-pink-2 mt-0 mb-3" v-model="query"/>
        <mdb-btn outline="white" size="sm" class="my-0" type="submit" @click="doSearch">Search</mdb-btn>
      </form>
      <li v-if="!loggedIn" class="nav-item ripple-parent" @click="scrollToElement(link4 + 'Section', $event)"><router-link to="/login" class="nav-link navbar-link"><mdb-icon icon="fingerprint" /> login</router-link></li>
      <account-links v-if="loggedIn"/>
    </mdb-navbar-nav>
  </mdb-navbar-toggler>
</mdb-navbar>
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

import { mdbContainer, mdbIcon, mdbRow, mdbCol, mdbNavbar, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbInput, mdbView, mdbMask, mdbBtn, mdbNavbarBrand } from 'mdbvue';
import AccountLinks from "@/layout/AccountLinks";
import AuctionLinks from "@/layout/AuctionLinks";
import artworkSearchService from "@/services/artworkSearchService";

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
      tagline: "tagline",
      taglink1: '',
      taglink2: '',
      bgImage: null,
      logo: require("@/assets/img/logo/T_8_Symbolmark_white.png")
    };
  },
  components: {
    AuctionLinks,
    AccountLinks,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbNavbar,
    mdbNavbarToggler,
    mdbNavbarNav,
    mdbNavItem,
    mdbInput,
    mdbView,
    mdbMask,
    mdbBtn,
    mdbIcon,
    mdbNavbarBrand
  },
  created() {
    this.getContent();
  },
  computed: {
    headerStyle() {
      return {
        "margin-top": "0px",
        "background-image": `url(${this.bgImage})`,
        "background-repeat": "no-repeat",
        "background-size": "cover",
        "background-position": "center center"
      };
    },
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    }
  },
  methods: {
    bodyClick() {
      let bodyClick = document.getElementById("bodyClick");

      if (bodyClick === null) {
        let body = document.querySelector("body");
        let elem = document.createElement("div");
        elem.setAttribute("id", "bodyClick");
        body.appendChild(elem);

        let bodyClick = document.getElementById("bodyClick");
        bodyClick.addEventListener("click", this.toggleNavbarMobile);
      } else {
        bodyClick.remove();
      }
    },
    getContent() {
      this.$prismic.client.getSingle("navbar").then(document => {
        this.link1 = document.data.link1[0].text;
        this.link2 = document.data.link2[0].text;
        this.link3 = document.data.link3[0].text;
        this.link4 = document.data.link4[0].text;
        this.title = document.data.title[0].text;
        this.tagline = document.data.tagline[0].text;
        this.taglink1 = document.data.taglink1[0].text;
        this.taglink2 = document.data.taglink2[0].text;
        this.bgImage = document.data.background.url;
      });
    },
    doSearch() {
      let qString = this.query;
      if (!this.query || this.query.length === 0) {
        qString = "*";
      }
      artworkSearchService.newQuery(qString);
      this.$router.push("/search?query=" + qString);
    },
    toggleNavbarMobile() {
      this.NavbarStore.showNavbar = !this.NavbarStore.showNavbar;
      this.toggledClass = !this.toggledClass;
      this.bodyClick();
    },
    handleScroll() {
      let scrollValue =
        document.body.scrollTop || document.documentElement.scrollTop;
      let navbarColor = document.getElementById("toolbar");
      this.currentScrollValue = scrollValue;
      if (this.colorOnScroll > 0 && scrollValue > this.colorOnScroll) {
        this.extraNavClasses = `md-${this.type}`;
        navbarColor.classList.remove("md-transparent");
      } else {
        if (this.extraNavClasses) {
          this.extraNavClasses = "";
          navbarColor.classList.add("md-transparent");
        }
      }
    },
    scrollListener() {
      resizeThrottler(this.handleScroll);
    },
    scrollToElement(element, event) {
      let domain = location.href;
      if (domain.indexOf("team") === -1) {
        event.preventDefault();
      }
      let element_id = document.getElementById(element);
      if (element_id) {
        element_id.scrollIntoView({ block: "start", behavior: "smooth" });
        setTimeout(() => {
            window.scrollBy(0, -40);
          }, 700);
      }
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      myAccountService.logout();
    }
  },
  mounted() {
    document.addEventListener("scroll", this.scrollListener);
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.scrollListener);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  min-height: 80px;
}
.navbar .md-form {
  margin: 0;
}
.top-nav-collapse {
  background-color: #333 !important;
}
@media (max-width: 990px){
  .navbar {
    background-color: #333 !important;
  }
}
.jarallax2 {
}
</style>
