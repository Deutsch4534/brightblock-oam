<template>
<mdb-container id="ContactSection">
    <section class="my-5 mx-5 px-5">
      <h2 class="h1-responsive font-weight-bold text-center my-5">{{title}}</h2>
      <p class="text-center w-responsive mx-auto pb-5">{{description}}</p>
      <mdb-row>
        <mdb-col md="9" class="md-0 mb-5">
          <form>
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
          </form>
          <div class="text-center text-md-left">
            <mdb-btn color="primary" size="md">Send</mdb-btn>
          </div>
        </mdb-col>
        <mdb-col md="3" class="text-center">
          <ul class="list-unstyled mb-0">
            <li>
              <mdb-icon icon="map-marker" size="2x" class="blue-text"/>
              <p><a href="https://goo.gl/maps/Riqykau1J1x">Brighton, BN1 1AL</a></p>
            </li>
            <li>
              <mdb-icon icon="phone" size="2x" class="blue-text mt-4"/>
              <p>...</p>
            </li>
            <li>
              <mdb-icon icon="envelope" size="2x" class="blue-text mt-4"/>
              <p>contact@example.com</p>
            </li>
          </ul>
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
  data() {
    return {
      title: "",
      name: "",
      form: "",
      email: "",
      message: "",
      description: "",
      fields: [],
      buttonText: null
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
        this.buttonText = document.data.button_text[0].text;
        this.fields = document.data.fields[0].text.split(",");
      });
    }
  }
};
</script>

<style scoped>
</style>
