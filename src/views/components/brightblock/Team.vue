<template>
<div class="section text-center" id="TeamSection">
  <div class="container">
    <profile-modal :showModal="showProfile" :bio="bio"/>
    <h2 class="title">{{title}}</h2>
    <div class="team">
        <div class="md-layout md-alignment-center-center">
          <div class="md-layout-item md-medium-size-25 md-small-size-50" v-for="(profile, index) in profiles" :key="index">
            <div class="team-player text-center" v-if="profile.data && profile.data.avatar && profile.data.jobtitle">
              <md-card class="md-card-plain">
                <div class="md-layout-item md-size-50 mx-auto">
                  <img :src="profile.data.avatar.url" alt="Thumbnail Image" class="img-raised rounded-circle img-fluid" @click="showTeamProfile(profile)">
                </div>
                <h4 class="card-title">{{profile.data.jobtitle[0].text}}
                  <br>
                  <router-link to="/profile" ><small class="card-description text-muted">{{profile.data.name[0].text}}</small>
                  </router-link>
                </h4>

                <md-card-content>
                  <p class="card-description">{{profile.data.jobdescription[0].text}}</p>
                </md-card-content>
              </md-card>
            </div>
          </div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import _ from "lodash";
import ProfileModal from "./ProfileModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Team",
  components: { ProfileModal },
  data() {
    return {
      profiles: [],
      bio: null,
      title: null,
      showProfile: false,
      name: null
    };
  },
  created() {
    this.getContent();
  },
  methods: {
    showTeamProfile(profile) {
      if (profile) {
        this.bio = profile;
        this.showProfile = true;
      }
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
  computed: {}
};
</script>
