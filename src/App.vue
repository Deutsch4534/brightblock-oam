<template>
  <div id="app">
    <router-view name="header"/>
    <router-view class="main raised"/>
    <router-view name="footer"/>
  </div>
</template>
<script>

export default {
  components: {},
  bodyClass: "index-page",
  data() {
    return {
      showLeafs: true
    };
  },
  mounted() {
    let routeName = this.$route.name;
    if (routeName === "brightBlock" || routeName === "profile") {
      this.showLeafs = true;
    }
  },
  updated() {
    let navbar = document.getElementById("main-navigation");
    navbar.classList.remove("navbar-expand-lg");
  },
};
</script>
<style>
  @font-face {
    font-family: 'Noto Serif Disp ExtCond';
    src: url('assets/fonts/NotoSerifDisplay-ExtraCondensedLight.eot');
    src: url('assets/fonts/NotoSerifDisplay-ExtraCondensedLight.eot?#iefix') format('embedded-opentype'),
    url('assets/fonts/NotoSerifDisplay-ExtraCondensedLight.woff2') format('woff2'),
    url('assets/fonts/NotoSerifDisplay-ExtraCondensedLight.woff') format('woff'),
    url('assets/fonts/NotoSerifDisplay-ExtraCondensedLight.svg#NotoSerifDisplay-ExtraCondensedLight') format('svg');
    font-weight: 300;
    font-style: normal;
  }

  header { min-height: 65px; }

.section-download {
  .btn + .btn {
    margin-left: 5px;
  }
}

.card {
  border: 3pt solid black!important;
  box-shadow: none;
  border-radius: 0;
}

.text-light {
  color: #ECEFF1!important;
}

.border-shadow::after {
  content: '';
  position: absolute;
  box-sizing: border-box;
  display: block;
  border: 4px solid black;
  left: 3px;
  top: 3px;
  right: -10px;
  bottom: -10px;
  z-index: -1;
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}

.h1 { font-size: 3rem; font-weight: normal; }

@media (min-width: 992px) {
  .h1-responsive {
    font-size: 300%;
    font-weight: normal!important;
  }
}

.raised {
  border-radius: 10px;
  position: relative;
  top: 35px;
  margin-bottom: 150px;
}

  /* Extra small devices (portrait phones, less than 576px) */
  @media (max-width: 575px) { }

  /*  Small devices (landscape phones, 576px and up) */
  @media (min-width: 576px) {
    h1.tagline {
      font-size: 300%;
    }
    .large-title {
      font-size: 200%;
    }
  }

  /* Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) {
    h1.tagline {
      font-size: 350%;
    }
    .large-title {
      font-size: 250%;
    }
  }

  /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {
    h1.tagline {
      font-size: 500%;
    }

    .h1-responsive {
      font-size: 250%;
    }

    .large-title {
      font-size: 300%;
    }
  }

  /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1200px) {
    .h1-responsive {
      font-size: 300%;
    }
    .large-title {
      font-size: 350%;
    }
  }
</style>
