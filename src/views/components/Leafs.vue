<template>
<div class="page-header header-filter" :style="headerStyle">
  <div class="md-layout">
    <div class="md-layout-item">
      <div class="image-wrapper">
        <img :src="leaf4" alt="leaf4" class="leaf4" v-show="leafShow">
        <img :src="leaf3" alt="leaf3" class="leaf3" v-show="leafShow">
        <img :src="leaf2" alt="leaf2" class="leaf2" v-show="leafShow">
        <img :src="leaf1" alt="leaf1" class="leaf1" v-show="leafShow">
        <div class="brand">
          <h1></h1>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      leafShow: false
    };
  },
  props: {
    image: {
      type: String,
      default: require("@/assets/img/vue-mk-header.jpg")
    },
    leaf4: {
      type: String,
      default: require("@/assets/img/leaf4.png")
    },
    leaf3: {
      type: String,
      default: require("@/assets/img/leaf3.png")
    },
    leaf2: {
      type: String,
      default: require("@/assets/img/leaf2.png")
    },
    leaf1: {
      type: String,
      default: require("@/assets/img/leaf1.png")
    }
  },
  methods: {
    leafActive() {
      if (window.innerWidth < 768) {
        this.leafShow = false;
      } else {
        this.leafShow = true;
      }
    }
  },
  mounted() {
    this.leafActive();
    window.addEventListener("resize", this.leafActive);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.leafActive);
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.image})`
      };
    }
  }
};
</script>

<style lang="css">
</style>
