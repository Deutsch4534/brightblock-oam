<template>
  <!-- TODO: connect template with Prismic cms -->
  <mdb-container fluid class="bg-light flex-1 mb-5">
    <mdb-container class="my-5">
      <mdb-row>
        <mdb-col col="12">
          <h1 class="h1-responsive p-2">{{title}}</h1>
        </mdb-col>
      </mdb-row>
      <help-faq-item v-if="topics" v-for="(topic, index) of topics" :key="index" :topic="topic"/>
  </mdb-container>
</mdb-container>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';
  import HelpFaqItem from "./HelpFaqItem";

  export default {
    components: {
      HelpFaqItem,
      mdbContainer,
      mdbRow,
      mdbCol
    },
    name: "about",
    data () {
      return {
        title: "",
        description: "",
        topicIds: [],
        topics: [],
        counter: -1
      }
    },
    mounted() {
      let pageid = this.$route.params.pageid;
      pageid = "help-page";
      let $self = this;
      this.$prismic.client.getSingle("help-list").then(document => {
        $self.title = document.data.title[0].text;
        $self.description = document.data.description[0].text;
        _.forEach(document.data["help-items"], function(item) {
          let topic = item["help-item"];
          if (topic && topic.id) {
            $self.topicIds.push(topic.id);
          }
        });
        $self.$prismic.client.getByIDs($self.topicIds).then(function(response) {
            $self.topics = response.results;
        });
      });
    },
    computed: {
      thisIndex() {
        return this.listIndex;
      }
    },
    methods: {
      nextIndex () {
        //this.listIndex++;
        //return this.listIndex;
      },
    },
  }
</script>
