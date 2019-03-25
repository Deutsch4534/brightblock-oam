<template>
  <section id="FeaturesSection" class="py-5">
    <mdb-row class="py-5 d-flex">
      <mdb-col col="12" lg="8">
        <h2 class="large-title mb-5">{{title}}</h2>
      </mdb-col>
      <div class="w-100"></div>
      <mdb-col md="12" lg="10" class="border-list">
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
      </mdb-col>
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

</style>
