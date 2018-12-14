<template>
  <div class="wrapper">
    <leafs/>
    <div class="main main-raised">
      <div class="section section-basic">
        <div class="container">
          <div id="images">
            <div class="title">
              <h2>Images</h2>
            </div>
            <last-artworks :artworks="artworks" class=""/>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import LastArtworks from "./components/home/LastArtworks";
import Leafs from "./components/Leafs";

export default {
  components: {
    LastArtworks,
    Leafs
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
