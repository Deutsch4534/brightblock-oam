<template>
<div>
  <md-dialog :md-active.sync="showModal" @md-closed="closeModal" v-if="bio && bio.data">
      <div class="section profile-content">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 mx-auto">
              <div class="profile">
                <div class="avatar">
                  <img :src="bio.data.avatar.url" alt="Circle Image" class="img-raised rounded-circle img-fluid">
                </div>
                <div class="name">
                  <h3 class="title">{{bio.data.name[0].text}}</h3>
                  <h6>{{bio.data.jobtitle[0].text}}</h6>
                  <md-button :href="social.url" class="md-just-icon md-simple" v-for="(social, index1) in bio.socials" :key="index1">
                    <i :class="social.classes"></i>
                  </md-button>
                </div>
              </div>
            </div>
          </div>
          <div class="description text-center">
            <p>{{bio.data.jobdescription[0].text}}</p>
          </div>
          <div class="profile-tabs">
            <tabs
              :tab-name="['Studio', 'Work', 'Favorite']"
              :tab-icon="['camera', 'palette', 'favorite']"
              plain
              nav-pills-icons
              color-button="success">

              <!-- here you can add your content for tab-content -->
              <template slot="tab-pane-1">
                <div class="md-layout">
                  <div class="md-layout-item md-size-25 ml-auto">
                    <img :src="tabPane1[0].image" class="rounded">
                    <img :src="tabPane1[1].image" class="rounded">
                  </div>
                  <div class="md-layout-item md-size-25 mr-auto">
                    <img :src="tabPane1[3].image" class="rounded">
                    <img :src="tabPane1[2].image" class="rounded">
                  </div>
                </div>
              </template>
              <template slot="tab-pane-2">
                <div class="md-layout">
                  <div class="md-layout-item md-size-25 ml-auto">
                    <img :src="tabPane2[0].image" class="rounded">
                    <img :src="tabPane2[1].image" class="rounded">
                    <img :src="tabPane2[2].image" class="rounded">
                  </div>
                  <div class="md-layout-item md-size-25 mr-auto">
                    <img :src="tabPane2[3].image" class="rounded">
                    <img :src="tabPane2[4].image" class="rounded">
                  </div>
                </div>
              </template>
              <template slot="tab-pane-3">
                <div class="md-layout">
                  <div class="md-layout-item md-size-25 ml-auto">
                    <img :src="tabPane3[0].image" class="rounded">
                    <img :src="tabPane3[1].image" class="rounded">
                  </div>
                  <div class="md-layout-item md-size-25 mr-auto">
                    <img :src="tabPane3[2].image" class="rounded">
                    <img :src="tabPane3[3].image" class="rounded">
                    <img :src="tabPane3[4].image" class="rounded">
                  </div>
                </div>
              </template>
            </tabs>
          </div>
        </div>
      </div>
  </md-dialog>
</div>
</template>

<script>
import _ from "lodash";
import { Tabs } from "@/components";
import Leafs from "../Leafs";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "ProfileModal",
  components: {
    Tabs,
    Leafs
  },
  bodyClass: "profile-page",
  props: {
    showModal: false,
    bio: null
  },
  data() {
    return {
      tabPane1: [
        { image: require("@/assets/img/examples/studio-1.jpg") },
        { image: require("@/assets/img/examples/studio-2.jpg") },
        { image: require("@/assets/img/examples/studio-4.jpg") },
        { image: require("@/assets/img/examples/studio-5.jpg") }
      ],
      tabPane2: [
        { image: require("@/assets/img/examples/olu-eletu.jpg") },
        { image: require("@/assets/img/examples/clem-onojeghuo.jpg") },
        { image: require("@/assets/img/examples/cynthia-del-rio.jpg") },
        { image: require("@/assets/img/examples/mariya-georgieva.jpg") },
        { image: require("@/assets/img/examples/clem-onojegaw.jpg") }
      ],
      tabPane3: [
        { image: require("@/assets/img/examples/mariya-georgieva.jpg") },
        { image: require("@/assets/img/examples/studio-3.jpg") },
        { image: require("@/assets/img/examples/clem-onojeghuo.jpg") },
        { image: require("@/assets/img/examples/olu-eletu.jpg") },
        { image: require("@/assets/img/examples/studio-1.jpg") }
      ],
      header: {
        type: String,
        default: require("@/assets/img/city-profile.jpg")
      },
      img: {
        type: String,
        default: require("@/assets/img/faces/christian.jpg")
      }
    };
  },
  created() {
    this.getContent();
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    getContent() {
      let $self = this;
      this.$prismic.client
        .query(this.$prismic.Predicates.at("document.type", "mini_profile"), {
          orderings: "[my.mini_profile.name desc]"
        })
        .then(function(response) {
          $self.profiles = response.results;
          _.forEach($self.profiles, function(prof) {
            try {
              let socAll = prof.data.sociallinks[0].text;
              let socPairs = socAll.split(",");
              prof.socials = [];
              _.forEach(socPairs, function(socPair) {
                if (socPair && socPair.indexOf("=") > 0) {
                  let classes = "";
                  let smedia = socPair.split("=")[0];
                  if (smedia === "twitter") {
                    classes = "fab fa-twitter";
                  } else if (smedia === "facebook") {
                    classes = "fab fa-facebook-square";
                  } else if (smedia === "instagram") {
                    classes = "fab fa-instagram";
                  }
                  prof.socials.push({
                    classes: classes,
                    url: socPair.split("=")[1]
                  });
                }
              });
            } catch (e) {
              // try again..
              console.log(e);
            }
          });
          // "twitter=https://twitter.com/mjoecohen,github=https://github.com/mjoecohen,facebook=https://www.facebook.com/mjoecohen"
        });
      this.$prismic.client.getSingle("profile").then(document => {
        this.title = document.data.title[0].text;
      });
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  }
};
</script>
<style scoped>
body.modal-open {
  overflow: hidden;
}
.md-dialog {
  max-height: calc(100vh - 210px);
  overflow-y: auto;
}
.section {
  padding: 0;
}

.profile-tabs /deep/ {
  .md-card-tabs .md-list {
    justify-content: center;
  }
}
</style>
