<template>
  <mdb-container id="MissionSection">
    <section class="text-center my-5 mx-5 px-5">
      <h2 class="h1-responsive font-weight-bold my-5">{{title}}</h2>
      <p class="lead grey-text w-responsive mx-auto mb-5" v-html="statement"></p>
      <mdb-row>
        <mdb-col md="4" v-for="(feature, index) in features" :key="index">
          <mdb-icon :icon="feature.data.icon[0].text" size="3x" class="yellow-text"/>
          <h5 class="font-weight-bold my-4">{{feature.data.title[0].text}}</h5>
          <p class="grey-text mb-md-0 mb-5">{{feature.data.description[0].text}}</p>
        </mdb-col>
      </mdb-row>
    </section>
  </mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbIcon, mdbBtn } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Mission",
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbIcon,
    mdbBtn
  },
  data() {
    return {
      features: [],
      title: null,
      statement: null
    };
  },
  created() {
    this.getContent();
  },
  methods: {
    getContent() {
      let $self = this;
      this.$prismic.client
        .query(
          this.$prismic.Predicates.at("document.type", "mission_feature"),
          {
            orderings: "[my.mission_feature.title]"
          }
        )
        .then(function(response) {
          $self.features = response.results;
        });
      this.$prismic.client.getSingle("mission").then(document => {
        this.title = document.data.title[0].text;
        this.statement = document.data.statement[0].text;
      });
    }
  }
};
</script>
