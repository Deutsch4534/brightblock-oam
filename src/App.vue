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
.section-download {
  .btn + .btn {
    margin-left: 5px;
  }
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
</style>
