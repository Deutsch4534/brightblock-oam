<template>
  <div id="app">
    <router-view name="header"/>
    <div class="wrapper">
      <div class="main main-raised">
        <router-view/>
      </div>
    </div>
    <router-view name="footer"/>
  </div>
</template>
<script>
import Leafs from "./views/components/Leafs";
import Leafless from "./views/components/Leafless";

export default {
  components: {
    Leafs,
    Leafless
  },
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
  }
};
</script>
<style>
.section-download {
  .md-button + .md-button {
    margin-left: 5px;
  }
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
