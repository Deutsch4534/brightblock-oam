<template>
  <section id="FeaturesSection" class="py-5">
    <mdb-row class="py-5 d-flex text-center">
      <mdb-col class="col-md-12 feature-text"  v-html="title">
      <p class="my-5"><router-link to="/about/faq"><button class="btn btn-large teal" style="font-size: 2.0em; border-radius: 5px">find out more</button></router-link></p>
      </mdb-col>
      <mdb-col md="4" class="border-list" v-html="feature1">
      </mdb-col>
      <mdb-col md="4" class="border-list" v-html="feature2">
      </mdb-col>
      <mdb-col md="4" class="border-list" v-html="feature3">
      </mdb-col>
      <!--
        <div class="list-item">
          <h3 class="h2-responsive"><a><mdb-icon icon="exchange-alt" class="mr-4" />{{feature1}}</a></h3>
        </div>
        <div class="list-item">
          <h3 class="h2-responsive"><a><mdb-icon icon="boxes" class="mr-4" />{{feature2}}</a></h3>
        </div>
        <div class="list-item">
          <h3 class="h2-responsive"><a><mdb-icon icon="bullseye" class="mr-4" />{{feature3}}</a></h3>
        </div>
        <div class="list-item">
          <h3 class="h2-responsive"><a><mdb-icon icon="campground" class="mr-4" />{{feature4}}</a></h3>
        </div>
      -->
    </mdb-row>
  </section>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';

export default {
  name: 'AudienceSection',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbIcon,
    mdbInput,
    mdbTextarea,
    mdbCard,
    mdbCardBody
  },
  data() {
    return {
      title: "FEATURES DESIGNED TO MAKE YOU TRULY INDEPENDENT",
      feature1: null,
      feature2: null,
      feature3: null,
      feature4: null,
    };
  },
  created() {
    let content = this.$store.state.contentStore.content["index-page"];
    this.title = content["section-features-title"][0].text;
    this.feature1 = content["section-features1"][0].text;
    this.feature2 = content["section-features2"][0].text;
    this.feature3 = content["section-features3"][0].text;
    this.feature4 = content["section-features4"][0].text;
  },
};
</script>

<style scoped>

 .border-list .list-item h3 {
  margin-bottom: 0;
}
.feature-text {
  color: teal;
  font-weight: 500;
  font-size: 3.0em;
  text-transform: capitalise;
}

</style>
