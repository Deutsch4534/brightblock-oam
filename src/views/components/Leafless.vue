<template>
<parallax class="page-header header-filter" :style="headerStyle">
  <div class="md-layout">
    <div class="md-layout-item">
      <div class="image-wrapper">
        <div class="brand">
          <h1>{{title}}</h1>
          <h3>{{tagline}}</h3>
        </div>
      </div>
    </div>
  </div>
</parallax>
</template>

<script>
export default {
  data() {
    return {
      leafShow: false,
      image: {
        type: String,
        default: require("@/assets/img/brightblock/gallery.png")
      },
      imageUrl: null,
      title: null,
      tagline: null,
      fields: {
        title: null,
        logo: null,
        richcontent: null
      }
    };
  },
  props: {},
  created() {
    this.getContent();
  },
  methods: {
    getContent() {
      this.$prismic.client.getSingle("home").then(document => {
        this.title = document.data.title[0].text;
        this.tagline = document.data.richcontent[0].text;
        this.imageUrl = document.data.bgimage.url;
      });
    }
  },
  mounted() {},
  beforeDestroy() {},
  computed: {
    headerStyle() {
      return {
        // backgroundImage: `url(${this.image})`
        backgroundImage: `url(${this.imageUrl})`
      };
    }
  }
};
</script>

<style lang="css">
</style>
