<template>
  <!-- TODO: connect template with Prismic cms -->
  <mdb-container fluid class="bg-light flex-1">
    <help-article v-if="showArticles" :pageid="pageid"/>
    <help-faq v-if="showFAQ" :pageid="pageid"/>
</mdb-container>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
  import HelpArticle from "./components/about/HelpArticle";
  import HelpFaq from "./components/about/HelpFaq";

  export default {
    components: {
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
        showArticles: false,
        showFAQ: false
      }
    },
    mounted() {
      this.pageid = this.$route.params.pageid;
      if (this.pageid === "help-list") {
        this.showArticles = true;
      } else {
        this.showFAQ = true;
      }
    },
    computed: {
    },
    methods: {
    },
  }
</script>
