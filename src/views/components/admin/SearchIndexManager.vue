<template>
<div>
<!--
  <div class="md-layout">
    <div class="md-layout-item md-size-20">
      <router-link
        to="/search-index-manager/search-names">
        Build
      </router-link>
    </div>
    <div class="md-layout-item md-size-20">
      <router-link
        to="/search-index-manager/search-dapps">
        Search
      </router-link>
    </div>
  </div>
-->
  <md-tabs class="md-accent" md-sync-route md-alignment="left">
    <md-tab id="build" md-label="Build" to="/search-index-manager/search-names"></md-tab>
    <md-tab id="search" md-label="Search" to="/search-index-manager/search-dapps"></md-tab>
  </md-tabs>
  <router-view></router-view>
</div>
</template>

<script>
import SearchDappsTab from "./SearchDappsTab";
import SearchBuilderTab from "./SearchBuilderTab";

export default {
  name: "SearchIndexManager",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: {
    SearchDappsTab,
    SearchBuilderTab
  }
};
</script>
<style scoped>
.md-tabs {
  margin-bottom: 3.5rem;
}
</style>
