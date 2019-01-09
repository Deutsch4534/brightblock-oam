<template>
<div class="section" id="missionSection">
  <div class="container">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto text-center">
        <h2 class="title text-center">{{title}}</h2>
        <h5 class="description">{{description}}</h5>
      </div>
    </div>
    <div class="features text-center">
      <div class="md-layout">
        <div class="md-layout-item md-medium-size-33 md-small-size-100" v-for="(feature, index) in features" :key="index">
          <div class="info">
            <div class="icon icon-info">
              <md-icon>{{feature.data.icon[0].text}}</md-icon>
            </div>
            <h4 class="info-title">{{feature.data.title[0].text}}</h4>
            <p>{{feature.data.description[0].text}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: "Mission",
  data() {
    return {
      features: [],
      title: null,
      description: null
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
        this.description = document.data.description[0].text;
      });
    }
  }
};
</script>
