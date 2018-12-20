<template>
  <div id="material-kit">
    <notifications position="bottom right" group="artwork-actions" />
    <div :class="{'nav-open': NavbarStore.showNavbar}">
      <router-view name="header"/>
      <div>
        <div class="wrapper">
          <leafs/>
          <div class="main main-raised">
            <div class="section section-basic">
              <router-view/>
            </div>
          </div>
        </div>
      </div>
      <router-view name="footer"/>
    </div>
  </div>
</template>
<script>
import Leafs from "./views/components/Leafs";

export default {
  components: {
    Leafs
  },
  bodyClass: "index-page"
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
