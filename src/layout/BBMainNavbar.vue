<template>
  <md-toolbar
    class="md-dark md-absolute"
    id="toolbar"
    :class="extraNavClasses"
    :color-on-scroll="colorOnScroll">
    <div class="md-toolbar-row md-collapse-lateral">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">
          <router-link to="/" style="color: white;">
            <span class="md-display-2"></span></router-link>
        </h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: toggledClass }"
          @click="toggleNavbarMobile()"
        >
          <span class="icon-bar"></span> <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <div class="md-collapse-wrapper">
            <mobile-menu nav-mobile-section-start="false">
              <!-- Here you can add your items from the section-start of your toolbar -->
            </mobile-menu>
            <md-list class="md-primary">
              <md-list-item>
                <i class="material-icons">pdf</i>
                <p><a href="https://prismic-io.s3.amazonaws.com/brightblock%2Ffce47ccb-a801-462b-ba00-5fb08102be10_brightblock_draft_proposal_1.pdf" class="md-subheading"><b>bright paper</b></a></p>
              </md-list-item>
              <md-list-item @click="scrollToElement(link1 + 'Section')">
                <i class="material-icons">dot</i>
                <p class="md-subheading"><b>{{link1}}</b></p>
              </md-list-item>
              <md-list-item @click="scrollToElement(link2 + 'Section')">
                <i class="material-icons">dot</i>
                <p class="md-subheading"><b>{{link2}}</b></p>
              </md-list-item>
              <md-list-item @click="scrollToElement(link3 + 'Section')">
                <i class="material-icons">dot</i>
                <p class="md-subheading"><b>{{link3}}</b></p>
              </md-list-item>
              <md-list-item @click="scrollToElement(link4 + 'Section')">
                <i class="material-icons">dot</i>
                <p class="md-subheading"><b>{{link4}}</b></p>
              </md-list-item>
            </md-list>
          </div>
        </div>
      </div>
    </div>
  </md-toolbar>
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

import MobileMenu from "@/layout/MobileMenu";

export default {
  components: {
    MobileMenu
  },
  props: {
    type: {
      type: String,
      default: "white",
      validator(value) {
        return [
          "white",
          "default",
          "primary",
          "danger",
          "success",
          "warning",
          "info"
        ].includes(value);
      }
    },
    colorOnScroll: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      extraNavClasses: "",
      toggledClass: false,
      showSearch: false,
      query: null,
      image: require("@/assets/img/brightblock/banner.png"),
      link1: "team",
      link2: "mission",
      link3: "contact",
      link4: "donate"
    };
  },
  created() {
    this.getContent();
  },
  computed: {},
  methods: {
    getContent() {
      this.$prismic.client.getSingle("navbar").then(document => {
        this.link1 = document.data.link1[0].text;
        this.link2 = document.data.link2[0].text;
        this.link3 = document.data.link3[0].text;
        this.link4 = document.data.link4[0].text;
      });
    },
    getLink(numb) {
      return "#link" + numb + "Section";
    },
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
    scrollToElement(element) {
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
