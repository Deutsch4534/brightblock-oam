<template>
  <!-- TODO: connect template with Prismic cms -->
  <mdb-container id="my-app-element" fluid class="" v-if="loaded">
    <div id="aboutSection">
      <about-section />
    </div>
    <help-article v-if="showArticles" :pageid="pageid"/>
    <help-faq v-if="showFAQ" :pageid="pageid"/>
</mdb-container>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
  import HelpArticle from "./components/about/HelpArticle";
  import HelpFaq from "./components/about/HelpFaq";
  import AboutSection from "./components/splash/AboutSection";

  export default {
    components: {
      AboutSection,
      HelpArticle,
      HelpFaq,
      mdbContainer,
      mdbRow,
      mdbCol
    },
    name: "about",
    data () {
      return {
        pageid: "",
        loaded: false,
        showArticles: false,
        showFAQ: false,
        loading: false,
      }
    },
    mounted() {
      this.pageid = this.$route.params.pageid;
      if (this.pageid === "help-list") {
        this.showArticles = true;
      } else {
        this.showFAQ = true;
      }
      this.$prismic.client.getSingle("help-list").then(document => {
        this.$store.commit("contentStore/helpList", document.data);
        let content = this.$store.state.contentStore.content["help-list"];
        this.loaded = true;
      });
    },
    computed: {
    },
    methods: {
    },
  }
</script>
