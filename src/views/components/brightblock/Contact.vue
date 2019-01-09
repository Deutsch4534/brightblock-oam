<template>
<div class="section section-contacts" id="contactSection">
  <div class="container">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto">
        <h2 class="text-center title">{{title}}</h2>
        <h4 class="text-center description">{{description}}</h4>
        <form class="contact-form">
            <div class="md-layout">
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label>{{fields[0]}}</label>
                    <md-input v-model="name" type="text"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field>
                    <label>{{fields[1]}}</label>
                    <md-input v-model="email" type="email"></md-input>
                  </md-field>
                </div>
            </div>
            <md-field maxlength="5">
              <label>{{fields[2]}}</label>
              <md-textarea v-model="message"></md-textarea>
            </md-field>
            <div class="md-layout">
              <div class="md-layout-item md-size-33 mx-auto text-center">
                <md-button class="md-success">{{buttonText}}</md-button>
              </div>
            </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// noinspection JSUnusedGlobalSymbols
export default {
  name: "Contact",
  data() {
    return {
      title: "",
      name: "",
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
        this.buttonText = document.data.button_text[0].text;
        this.fields = document.data.fields[0].text.split(",");
      });
    }
  }
};
</script>
