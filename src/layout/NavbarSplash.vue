<template>
<!-- Main navigation 424f95 -->
<header>
<mdb-navbar :color="'stylish'" position="top" dark href="#" transparent scrolling>
  <!-- mdbNavbar brand -->
  <mdb-navbar-brand>
    <!-- <router-link to="/" name="sectionUrl(link1 + 'Section')" class="navbar-brand"><img :src="logo" height="50" alt=""></router-link> -->
  </mdb-navbar-brand>
  <mdb-navbar-toggler>
    <mdb-navbar-nav mx-auto>
      <li class="nav-item ripple-parent" @click="scrollToElement('TeamSection', $event)"><router-link to="/" name="sectionUrl('TeamSectionSection')" class="nav-link navbar-link" >Team</router-link></li>
      <li class="nav-item ripple-parent" @click="scrollToElement('ContactSection', $event)"><router-link to="/" name="sectionUrl('ContactSection')" class="nav-link navbar-link">Contact</router-link></li>
    </mdb-navbar-nav>
    <mdb-navbar-nav right>
      <form class="form-inline">
        <mdb-input label="Search" type="text" class="active-white active-white-2 mt-0 mb-3" v-model="query"/>
        <mdb-btn outline="white" size="sm" class="my-0" type="submit" @click="doSearch">Search</mdb-btn>
      </form>
      <li v-if="!loggedIn" class="nav-item ripple-parent"><router-link to="/login" class="nav-link navbar-link"><mdb-icon icon="fingerprint" /> login</router-link></li>
      <account-links v-if="loggedIn"/>
    </mdb-navbar-nav>
  </mdb-navbar-toggler>
</mdb-navbar>
  <!-- Full Page Intro https://mdbootstrap.com/img/Photos/Others/img%20%2848%29.jpg -->
  <div class="view jarallax" :style="headerStyle">
    <!-- Mask & flexbox options-->
    <div class="mask rgba-black-light d-flex justify-content-center align-items-center">
      <!-- Content -->
      <div class="container">
        <!--Grid row-->
        <div class="row">
          <!--Grid column-->
          <div class="col-md-12 mb-4 white-text text-left">
            <h5 class="text-uppercase mb-4 white-text wow fadeInDown" data-wow-delay="0.4s"><strong v-html="tagline"></strong></h5>
            <router-link :to="getAuctionLink"><mdb-btn outline="white">Learn More</mdb-btn></router-link>
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
    splashPage() {
      return this.$route.name === "index";
    },
    loggedIn() {
      let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return myProfile.loggedIn;
    },
    getAuctionLink() {
      return this.taglink1;
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
        // setTimeout(() => {
        //    window.scrollBy(0, -40);
        //  }, 700);
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
  background-color: #333 !important;
}
@media (max-width: 990px){
  .navbar {
    background-color: #333 !important;
  }
}
.view {
  background-image: url('https://mdbootstrap.com/img/Photos/Others/architecture.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: calc(120vh - 60px);
}
.view2 {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: calc(15vh - 60px);
}
.jarallax2 {
  min-height: 100px;
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
