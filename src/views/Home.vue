<template>
<div class="container">
  <div id="images">
    <last-artworks :artworks="artworks" class=""/>
  </div>
</div>
</template>

<script>
import LastArtworks from "./components/home/LastArtworks";

export default {
  components: {
    LastArtworks
  },
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
