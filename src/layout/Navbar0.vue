<template>
<!-- Main navigation -->
<header>
<mdb-navbar :color="'primary'" position="top" dark href="#" transparent scrolling>
  <!-- mdbNavbar brand -->
  <mdb-navbar-brand>
    <router-link to="/" name="sectionUrl(link1 + 'Section')" class="navbar-brand"><img :src="logo" height="50" alt=""></router-link>
  </mdb-navbar-brand>
  <mdb-navbar-toggler>
    <mdb-navbar-nav left>
      <li class="nav-item ripple-parent" @click="scrollToElement(link1 + 'Section', $event)"><router-link to="/" name="sectionUrl(link1 + 'Section')" class="nav-link navbar-link" >{{link1}}</router-link></li>
      <li class="nav-item ripple-parent" @click="scrollToElement(link2 + 'Section', $event)"><router-link to="/" name="sectionUrl(link2 + 'Section')" class="nav-link navbar-link">{{link2}}</router-link></li>
      <li class="nav-item ripple-parent" @click="scrollToElement(link3 + 'Section', $event)"><router-link to="/" name="sectionUrl(link3 + 'Section')" class="nav-link navbar-link">{{link3}}</router-link></li>
      <li class="nav-item ripple-parent" @click="scrollToElement(link4 + 'Section', $event)"><router-link to="/" name="sectionUrl(link4 + 'Section')" class="nav-link navbar-link">{{link4}}</router-link></li>
    </mdb-navbar-nav>
    <mdb-navbar-nav right>
      <auction-links/>
      <li v-if="!loggedIn" class="nav-item ripple-parent" @click="scrollToElement(link4 + 'Section', $event)"><router-link to="/login" class="nav-link navbar-link"><mdb-icon icon="fingerprint" /> login</router-link></li>
      <account-links v-if="loggedIn"/>
    </mdb-navbar-nav>
  </mdb-navbar-toggler>
</mdb-navbar>
  <!-- Full Page Intro https://mdbootstrap.com/img/Photos/Others/img%20%2848%29.jpg -->
  <div class="view jarallax" :style="headerStyle" v-if="homePage">
    <!-- Mask & flexbox options-->
    <div class="mask rgba-black-light d-flex justify-content-center align-items-center">
      <!-- Content -->
      <div class="container">
        <!--Grid row-->
        <div class="row">
          <!--Grid column-->
          <div class="col-md-12 mb-4 white-text text-center">
            <h1 class="h1-reponsive white-text text-uppercase font-weight-bold mb-0 pt-md-5 pt-5 wow fadeInDown"
              data-wow-delay="0.3s"><strong>{{title}}</strong></h1>
            <hr class="hr-light my-4 wow fadeInDown" data-wow-delay="0.4s">
            <h5 class="text-uppercase mb-4 white-text wow fadeInDown" data-wow-delay="0.4s"><strong v-html="tagline"></strong></h5>
            <mdb-btn outline="white" v-if="taglink1.length > 0" v-html="taglink1"></mdb-btn>
            <mdb-btn outline="white" v-if="taglink2.length > 0" v-html="taglink2"></mdb-btn>
            <!--
            <a mdbBtn color="white" outline="true" mdbWavesEffect class="wow fadeInDown" data-wow-delay="0.4s">portfolio</a>
            <a mdbBtn color="white" outline="true" mdbWavesEffect class="wow fadeInDown" data-wow-delay="0.4s">About me</a>
            -->
          </div>
          <!--Grid column-->
        </div>
        <!--Grid row-->
      </div>
      <!-- Content -->
    </div>
    <!-- Mask & flexbox options-->
  </div>
  <!-- Full Page Intro -->
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

export default {
  name: 'Navbar',
  data() {
    return {
      link1: "team",
      link2: "mission",
      link3: "contact",
      link4: "donate",
      title: "title",
      tagline: "tagline",
      taglink1: '',
      taglink2: '',
      bgImage: null,
      logo1: require("@/assets/img/T8_Symbol_black.png"),
      logo: require("@/assets/img/transit8-logo.jpg")
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
    homePage() {
      return this.$route.path === "home";
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
      if (!this.query) {
        this.query = "*";
      }
      this.$router.push("/search?query=" + this.query);
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
.navbar .md-form {
  margin: 0;
}
.top-nav-collapse {
  background-color: #424f95 !important;
}
@media (max-width: 990px){
  .navbar {
    background-color: #424f95 !important;
  }
}
.view {
  background-image: url('https://mdbootstrap.com/img/Photos/Others/architecture.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: calc(100vh - 60px);
}
.gradient {
  background: -moz-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  background: -webkit-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  background: -webkit-gradient(linear, 45deg, from(rgba(42, 27, 161, 0.7)), to(rgba(29, 210, 177, 0.7)));
  background: -o-linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
  background: linear-gradient(45deg, rgba(42, 27, 161, 0.7), rgba(29, 210, 177, 0.7) 100%);
}
h6 {
  line-height: 1.7;
}
</style>
