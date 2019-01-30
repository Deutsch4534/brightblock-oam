<template>
<div class="col-md-4">
  <figure class="figure mr-4">
    <router-link :to="artworkUrl">
      <img :src="artwork.image" alt="artwork.title" class="figure-img img-fluid z-depth-1" style="width: 400px">
    </router-link>
    <figcaption class="figure-caption text-right">
      {{artwork.title}} (By: {{artwork.artist}})
      <span v-if="debugMode">{{artwork.bcitem.itemIndex}}, Owner: {{artwork.owner}}</span>
    </figcaption>
  </figure>
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
