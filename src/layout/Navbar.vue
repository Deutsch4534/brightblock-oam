<template>
<!-- Main navigation 424f95 -->
<header>
  <!-- Navbar -->
  <mdb-navbar position="top" href="#" expand="lx" transparent scrolling hamburger animated animation="3" id="main-navigation">
    <!-- mdbNavbar brand -->
    <mdb-navbar-brand>
      <form class="md-form search-form">
        <a type="button" @click="doSearch">
          <mdb-icon class="mb-0 mr-2" icon="search" />
        </a>
        <input label="Search" type="text" class="mt-0 mb-0" v-model="query"
               placeholder="Search" aria-label="Search"/>
      </form>
      <!-- <router-link to="/" name="sectionUrl(link1 + 'Section')" class="navbar-brand"><img :src="logo" height="50" alt=""></router-link> -->
    </mdb-navbar-brand>
    <mdb-navbar-nav right>
      <li v-if="!loggedIn" class="nav-item ripple-parent">
        <router-link to="/login" class="nav-link navbar-link login-link mr-2">
        Login
        </router-link>
      </li>
      <account-links v-if="loggedIn"/>
    </mdb-navbar-nav>
    <mdb-navbar-toggler>
      <mdb-navbar-nav mx-auto>
        <li class="nav-item ripple-parent">
          <router-link to="/gallery" class="nav-link navbar-link">Gallery</router-link>
        </li>
        <li class="nav-item ripple-parent">
          <router-link to="/artists" class="nav-link navbar-link">Artists</router-link>
        </li>
        <li class="nav-item ripple-parent">
          <router-link to="/online-auctions" class="nav-link navbar-link">Auctions</router-link>
        </li>
        <auction-links v-if="loggedIn"/>
        <div class="mb-4"></div>
        <li v-if="!loggedIn" class="nav-item ripple-parent">
          <router-link to="/login" class="nav-link navbar-link">
            Login
          </router-link>
        </li>
        <li v-if="loggedIn" class="nav-item ripple-parent">
          <a href="#"
             @click.prevent="logout"
             class="nav-link navbar-link">
            Logout</a
          >
        </li>
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

import { mdbContainer, mdbIcon, mdbRow, mdbCol, mdbNavbar, mdbNavbarToggler, mdbNavbarNav, mdbNavItem, mdbInput, mdbView, mdbMask, mdbBtn, mdbNavbarBrand } from 'mdbvue';
import AccountLinks from "@/layout/AccountLinks";
import AuctionLinks from "@/layout/AuctionLinks";
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
      tagline: "tagline",
      taglink1: '',
      taglink2: '',
      bgImage: null,
      logo: require("@/assets/img/logo/logo-black-256x256.png")
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
    featureAuctions() {
      return this.$store.state.constants.featureAuctions;
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
    let navMenuItems = document.querySelectorAll(".navbar-collapse li a.nav-link.navbar-link");
    navMenuItems.forEach((item) => {
        item.addEventListener('click', this.toggleMenu);
    });
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.scrollListener);
    let navMenuItems = document.querySelectorAll('.navbar-collapse li a.nav-link.navbar-link');
    navMenuItems.forEach((item) => {
      item.removeEventListener('click', this.toggleMenu);
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .navbar {
    border-bottom: 1px solid lightgray;
    box-shadow: none;
    min-height: 50px;
    background-color: white;
    flex-wrap: nowrap;
  }
  .scrolling-navbar { padding: 4px 28px!important; }

  .top-nav-collapse {
    background-color: white !important;
  }

  nav >>> .navbar-toggler {
    z-index: 4;
  }

  .navbar-collapse {
    position: absolute;
    background-color: #5400E8;
    top: 0;
    right: 0;
    width: 40vw;
    height: 0;
    padding: 30px 35px;
  }

  .navbar-collapse .nav-item { max-width: 90vw;}
  .navbar-collapse .nav-item,
  .navbar-collapse .nav-item .nav-link {  color: white!important; }

  .show-navbar {
    min-height: 100vh;
    z-index: 3;
    font-size: 2.5rem;
    text-transform: uppercase;
    line-height: 1;
  }

>>> .animated-icon3 span { background: black!important; }
>>> .animated-icon3.open span { background: white!important; }

nav >>> .navbar-brand {
    max-width: 45vw;
}
  .navbar .md-form {
    margin: 0;
  }
  i.fa-search {
    color: black;
    transform: rotate(90deg);
    font-size: 24px;
  }
  .search-form input, .login-link { font-size: 20px; font-weight: 300; letter-spacing: 0.5px;}
  .search-form input { border-bottom: none; }
  .search-form input:focus { box-shadow: none!important; border-bottom: none!important; }

  .search-form input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: black;
  }
  .search-form input::-moz-placeholder { /* Firefox 19+ */
    color: black;
  }
  .search-form input:-ms-input-placeholder { /* IE 10+ */
    color: black;
  }
  .search-form input:-moz-placeholder { /* Firefox 18- */
    color: black;
  }
  .search-form button.transparent { border: none; background: transparent; color: black; }

.jarallax2 {
}
.navbar a { color: inherit; }

@media (max-width: 990px) {
  .navbar-collapse {
    width: 60vw;
  }
}

  @media (max-width: 576px) {
    header { min-height:50px; }

   .search-form input, .login-link { font-size: 14px; }
    nav >>> .navbar-toggler {
      padding: 0 0 0.25rem 0.5rem;
      font-size: 0.8rem;
    }
    .login-link { display: flex!important; }

    .navbar-collapse {
      width: 100vw;
    }

    .navbar-nav .nav-item >>> a.user-menu img {
      width: 24px!important;
      height: 24px!important;
      border-radius: 12px!important;
    }
    .show-navbar {
      font-size: 1.5rem;
    }
  }
</style>
