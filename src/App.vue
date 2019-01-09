<template>
  <div id="material-kit">
    <notifications position="bottom right" group="artwork-actions" />
    <div :class="{'nav-open': NavbarStore.showNavbar}">
      <router-view name="header"/>
      <div>
        <div class="wrapper">
          <leafs v-if="showLeafs"/>
          <leafless v-else/>
          <div class="main main-raised">
            <router-view/>
          </div>
        </div>
      </div>
      <router-view name="footer"/>
    </div>
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
    if (routeName === "brightBlock") {
      this.showLeafs = false;
    }
  }
};
</script>
<style lang="scss">
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
