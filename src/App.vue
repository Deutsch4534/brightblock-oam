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
  }
};
</script>
<style>
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

.raised {
  border-radius: 10px;
  position: relative;
  top: 35px;
  margin-bottom: 150px;
}
</style>
