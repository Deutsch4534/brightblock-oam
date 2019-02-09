<template>
<div class="container mt-5">
  <div class="row">
    <div class="col-md-2">
      <h5><small>Admin Actions</small></h5>
      <ul class="list-unstyled">
        <li><a href="#/admin/settings">Settings</a></li>
        <li><a href="#/admin/bitcoin">Bitcoin</a></li>
        <li><a href="#/admin/registrations">Ethereum</a></li>
        <li><a href="#/admin/build-index">Build Index</a></li>
        <li><a href="#/admin/query-index">Query Index</a></li>
      </ul>
    </div>
    <div class="col-md-10">
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
      return this.$store.getters["artworkSearchStore/homePageArtworks"];
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
  .btn + .btn {
    margin-left: 5px;
  }
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
</style>
