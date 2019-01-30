<template>
<mdb-container fluid id="ContactSection" class="p-5 text-white">
    <section class="my-5 mx-5 px-5">
      <h2 class="h1-responsive font-weight-bold mt-5">{{title}}</h2>
      <p v-html="featureMessage"></p>
      <mdb-row>
        <mdb-col md="6" class="md-0 p-5">
          <div class="col-md-12">
            <router-link to="/" class="navbar-brand"><img :src="logo" height="100px" alt="t8 logo"></router-link>
          </div>
          <div class="col-md-12">
            <h5 class="my-4">Contact Info</h5>
            <p>Brighton, UK</p>
            <p>Phone: +49 6579 3 456</p>
            <p>Email: contact@transit8.com</p>
          </div>
        </mdb-col>
        <mdb-col md="6" class="text-white">
          <form class="text-white">
            <mdb-row>
              <mdb-col md="6">
                <div class="md-form mb-0">
                  <mdb-input type="text" id="contact-name" label="Your name" />
                </div>
              </mdb-col>
              <mdb-col md="6">
                <div class="md-form mb-0">
                  <mdb-input type="text" id="contact-email" label="Your email" />
                </div>
              </mdb-col>
            </mdb-row>
            <mdb-row>
              <mdb-col md="12">
                <div class="md-form mb-0">
                  <mdb-input type="text" id="contact-subject" label="Subject" />
                </div>
              </mdb-col>
            </mdb-row>
            <mdb-row>
              <mdb-col md="12">
                <div class="md-form mb-0">
                  <mdb-textarea id="contact-message" label="Your message" />
                </div>
              </mdb-col>
            </mdb-row>
            <div class="text-center text-md-left">
              <span size="md" @click="submit">SUBMIT</span>
            </div>
          </form>
        </mdb-col>
      </mdb-row>
    </section>
  </mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';

export default {
  name: 'ContactSection',
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
  props: ["featureMessage"],
  data() {
    return {
      title: "",
      name: "",
      form: "",
      email: "",
      message: "",
      description: "",
      fields: [],
      buttonText: null,
      logo: require("@/assets/img/logo/T_8_Symbolmark_white.png")
    };
  },
  created() {
    this.getContent();
  },
  methods: {
    getContent() {
      this.$prismic.client.getSingle("contact").then(document => {
        this.title = document.data.title[0].text;
        this.description = document.data.description[0].text;
        this.form = document.data.form[0].text;
      });
    },
    submit() {
      console.log("Code to send message needed here.. " + this.message);
      // send the message
    }
  },
  computed: {
  }
};
</script>

<style>
#ContactSection {
  background-color: #5400E8;
}
.raised {
  border-radius: 10px;
  position: relative;
  top: 35px;
  margin: auto auto;
  margin-bottom: 50px;
}

</style>
