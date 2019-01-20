<template>
<div class="container">
  <div class="md-layout">
    <div class="md-layout-item md-size-25 md-xsmall-size-25">
      <aside class="">
        <h5><small>Admin Actions</small></h5>
        <ul class="list-unstyled">
          <li><a href="#/admin/settings">Settings</a></li>
          <li><a href="#/admin/registrations">Ethereum Blockchain</a></li>
          <li><a href="#/search-index-manager">Search Settings</a></li>
        </ul>
      </aside>
    </div>
    <div class="md-layout-item md-size-75 md-xsmall-size-75">
      <router-view></router-view>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "home",
  bodyClass: "index-page",
  props: {
    image: {
      type: String,
      default: require("@/assets/img/vue-mk-header.jpg")
    },
    signup: {
      type: String,
      default: require("@/assets/img/city.jpg")
    }
  },
  data() {
    return {
      firstname: null,
      email: null,
      password: null
    };
  },
  methods: {},
  computed: {
    artworks() {
      return this.$store.getters["artworkSearchStore/getHomePageArtworks"];
    },
    signupImage() {
      return {
        backgroundImage: `url(${this.signup})`
      };
    }
  },
  mounted() {}
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
