<template>
<!--Navbar-->
<mdb-navbar dark position="top" class="blue-grey" scrolling>
  <!-- mdbNavbar brand -->
  <mdb-navbar-brand href="/">
    BrightBlock
  </mdb-navbar-brand>
  <mdb-navbar-toggler>
    <mdb-navbar-nav right>
      <li class="nav-item ripple-parent" @click="scrollToElement(link1 + 'Section', $event)"><router-link to="/" name="sectionUrl(link1 + 'Section')" class="nav-link navbar-link" >{{link1}}</router-link></li>
      <li class="nav-item ripple-parent" @click="scrollToElement(link2 + 'Section', $event)"><router-link to="/" name="sectionUrl(link2 + 'Section')" class="nav-link navbar-link">{{link2}}</router-link></li>
      <li class="nav-item ripple-parent" @click="scrollToElement(link3 + 'Section', $event)"><router-link to="/" name="sectionUrl(link3 + 'Section')" class="nav-link navbar-link">{{link3}}</router-link></li>
      <li class="nav-item ripple-parent" @click="scrollToElement(link4 + 'Section', $event)"><router-link to="/" name="sectionUrl(link4 + 'Section')" class="nav-link navbar-link">{{link4}}</router-link></li>
    </mdb-navbar-nav>
  </mdb-navbar-toggler>
</mdb-navbar>
<!--/.Navbar-->
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

import { mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbContainer, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbNavbarBrand, mdbIcon, mdbRow } from 'mdbvue';
import AccountLinks from "@/layout/AccountLinks";

export default {
  name: 'NavbarPage',
  components: {
    AccountLinks,
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
    mdbIcon,
    mdbRow
  },
  data() {
    return {
      link1: "team",
      link2: "mission",
      link3: "contact",
      link4: "donate"
    };
  },
  created() {
    this.getContent();
  },
  computed: {
    showDownload() {
      const excludedRoutes = ["login", "landing", "profile"];
      return excludedRoutes.every(r => r !== this.$route.name);
    },
    showAdmin() {
      return this.$store.state.myAccountStore.myProfile.showAdmin;
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
        return '<span class="fa fa-user"></span>';
      }
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
      });
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
    sectionUrl(link) {
      return `/#${link}`;
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
</style>
