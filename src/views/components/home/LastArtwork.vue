<template>
<div class="md-layout-item md-size-20 md-xsmall-size-100" :class="{'text-center': responsive}">
  <router-link :to="artworkUrl">
    <img :src="artwork.image" alt="artwork.title" class="rounded" :class="{'responsive-image': responsive}">
    <h5 class="pt-2"><small>{{artwork.title}}</small></h5>
    <p><small>{{artwork.description}}</small></p>
    <p class="art-title" v-if="debugMode">{{artwork.bcitem.itemIndex}}</p>
    <p class="art-title" v-if="debugMode">Artist: {{artwork.artist}}</p>
    <p class="art-title" v-if="debugMode">Owner: {{artwork.owner}}</p>
  </router-link>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: "LastArtwork",
  props: {
    artwork: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      image: require("@/assets/img/faces/avatar.jpg"),
      responsive: false
    };
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  methods: {
    onResponsiveInverted() {
      if (window.innerWidth < 600) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    }
  },
  computed: {
    artworkUrl() {
      return `/artworks/${this.artwork.owner}/${this.artwork.id}`;
    },
    debugMode() {
      return this.$store.getters["isDebugMode"];
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  }
};
</script>
