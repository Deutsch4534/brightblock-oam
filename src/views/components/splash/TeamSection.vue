<template>
  <!--<mdb-container>-->
  <section id="TeamSection" class="py-5">
    <mdb-row class="py-3 py-md-5 d-flex">
      <mdb-col col="12">
        <h2 class="large-title text-left mb-5">{{title}}</h2>
      </mdb-col>
      <mdb-card class="bg-transparent w-100 col-sm-6 col-md-4 col-lg-3 mb-3 d-flex" v-for="(profile, index) in profiles"
                :key="index">
        <mdb-view hover>
          <router-link :to="profileUrl(profile)">
            <mdb-card-image :src="profile.data.avatar.url" alt="Thumbnail Image" class="img-square"></mdb-card-image>
          </router-link>
          <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
        </mdb-view>
        <mdb-card-body class="px-0">
          <mdb-card-title class="artist-name h4-responsive">
            <router-link :to="profileUrl(profile)">
              <p class="mb-1 text-uppercase">{{profile.data.name[0].text}}</p>
            </router-link>
            <p class="mb-1">{{profile.data.jobtitle[0].text}}</p>
          </mdb-card-title>
          <mdb-card-text>
            <p v-html="profile.data.jobdescription[0].text" class="description mb-0"></p>
            <!--  <ul class="list-unstyled mb-0">
                    <a :href="social.url" class="p-2 fa-lg" v-for="(social, index1) in profile.socials" :key="index1">
                      <mdb-icon :icon="social.smedia" class="blue-text"/>
                    </a>
                  </ul> -->
          </mdb-card-text>
        </mdb-card-body>
      </mdb-card>
    </mdb-row>
  </section>
  <!--</mdb-container>-->
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbAvatar, mdbIcon, mdbCard, mdbCardBody, mdbCardImage, mdbCardTitle, mdbCardText, mdbView, mdbMask } from 'mdbvue';

export default {
  name: 'TeamSection',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbAvatar,
    mdbIcon,
    mdbCard,
    mdbCardBody,
    mdbCardImage,
    mdbCardTitle,
    mdbCardText,
    mdbView,
    mdbMask
  },
  data() {
    return {
      profiles: [],
      title: null,
      description: ''
    };
  },
  created() {
    this.getContent();
  },
  methods: {
    getContent() {
      let $self = this;
      this.$prismic.client
        .query(this.$prismic.Predicates.at("document.type", "mini_profile"), {
          orderings: "[my.mini_profile.name desc]"
        })
        .then(function(response) {
          $self.profiles = response.results;
          _.forEach($self.profiles, function(prof) {
            $self.$store.commit("userProfilesStore/addTeamProfile", prof);
            try {
              let socAll = prof.data.sociallinks[0].text;
              let socPairs = socAll.split(",");
              prof.socials = [];
              _.forEach(socPairs, function(socPair) {
                if (socPair && socPair.indexOf("=") > 0) {
                  let smedia = socPair.split("=")[0];
                  prof.socials.push({
                    smedia: smedia,
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
    },
    profileUrl(profile) {
      return `/profile/team/${profile.id}`;
    }
  }
};
</script>
<style scoped>
  .description { font-size: 90%; }
</style>
