<template>
<mdb-row>
  <mdb-col col="12">
    <h1 class="h1-responsive py-4"></h1>
  </mdb-col>
  <mdb-col sm="10" md="8">
  <h4><a @click="showDescription = !showDescription">{{topic.data.title[0].text}}</a></h4>
  <p v-if="showDescription" v-html="topic.data.description[0].text"></p>
  </mdb-col>
</mdb-row>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol } from 'mdbvue';

  export default {
    components: {
      mdbContainer,
      mdbRow,
      mdbCol
    },
    name: "about",
    props: ["topic"],
    data() {
      return {
        showDescription: false
      };
    },
    mounted() {
      console.log(this.topic);
    },
    computed: {
    },
    methods: {
    },
  }
</script>
