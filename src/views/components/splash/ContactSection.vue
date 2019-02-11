<template>
<mdb-container id="ContactSection" class="py-5">
    <section class="mt-5 mb-0 px-0">
      <mdb-row>
        <mdb-col class="col-lg-10 mx-auto">
        <h2 class="large-title my-5">{{title}}</h2>
        <p v-html="featureMessage"></p>
        <mdb-row>
          <mdb-col md="6" class="md-0 px-0">
            <div class="col-md-12">
              <router-link to="/" class="navbar-brand"><img :src="logo" height="100px" alt="radicle logo"></router-link>
            </div>
            <div class="col-md-12">
              <h5 class="my-4">Contact Info</h5>
              <p>Brighton, BN1 1AL UK</p>
              <p>Phone: +49 6579 3 456</p>
              <p>Email: contact@radicle.art</p>
            </div>
          </mdb-col>
          <mdb-col md="6">
            <form class="contact-form">
              <mdb-row>
                <mdb-col md="12">
                  <div class="mb-0">
                    <mdb-input type="text" id="contact-name" label="Your name" />
                  </div>
                </mdb-col>
                <mdb-col md="12">
                  <div class="mb-0">
                    <mdb-input type="text" id="contact-email" label="Your email" />
                  </div>
                </mdb-col>
              </mdb-row>
              <mdb-row>
                <mdb-col md="12">
                  <div class="mb-0">
                    <mdb-input type="text" id="contact-subject" label="Subject" />
                  </div>
                </mdb-col>
              </mdb-row>
              <mdb-row>
                <mdb-col md="12">
                  <div class="mb-0">
                    <mdb-textarea id="contact-message" label="Your message" />
                  </div>
                </mdb-col>
              </mdb-row>
              <div class="text-md-left mt-5 submit">
                <span type="button" class="h1-responsive" @click="submit">SUBMIT</span>
              </div>
            </form>
          </mdb-col>
        </mdb-row>
        <mdb-row>
          <mdb-col col="12 mt-5">
           <span class="copyright">© 2018 RADICLE. ALL RIGHTS RESERVED.</span>
          </mdb-col>
        </mdb-row>
        </mdb-col>
      </mdb-row>
    </section>
  </mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';
import axios from "axios";

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
      subject: "",
      email: "",
      message: "",
      description: "",
      fields: [],
      buttonText: null,
      logo: require("@/assets/img/logo/logo-black-256x256.png")
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
      let data = {
        text: this.message,
        subject: this.subject,
        originatorEmail: this.email,
        originatorName: this.name,
      };
      let callInfo = {
        method: "post",
        url: this.$store.state.constants.ethGatewayUrl + "/api/sendEmail",
        headers: {
          "Content-Type": "application/json"
        }
      };
      return new Promise((resolve, reject) => {
        axios
          .post(callInfo.url, data)
          .then(response => {
            if (response.failed) {
              reject(new Error(response.message));
            }
            resolve(response.data.details);
          })
          .catch(e => {
            reject(new Error(e.message));
          });
      });
    }
  },
  computed: {
  }
};
</script>

<style>
.raised {
  border-radius: 10px;
  position: relative;
  top: 35px;
  margin: auto auto;
  margin-bottom: 50px;
}
.contact-form .md-form label,
.contact-form .md-form textarea ~ label.active {
  color: inherit!important;
  text-transform: uppercase;
  letter-spacing: 0.5px;

}

.contact-form .form-control {
  color: inherit;
  font-weight: normal;
}

  .contact-form .submit {
    cursor: pointer;
  }
</style>
<style scoped>
  .md-form {
    margin-top: 0.7rem;
    margin-bottom: 0.7rem;
  }
.copyright {
  font-size: 0.7rem;
}
</style>
