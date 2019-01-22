<template>
  <mdb-container id="TeamSection">
    <section class="mx-5px-5 text-center">
      <h2 class="h1-responsive font-weight-bold my-5">{{title}}</h2>
      <p class="grey-text w-responsive mx-auto mb-5">{{description}}</p>
      <mdb-row>
        <mdb-col lg="6" md="6"  class="mb-lg-0 mb-5 pb-5" v-for="(profile, index) in profiles" :key="index">
          <router-link :to="profileUrl(profile)"><mdb-avatar tag="img" :src="profile.data.avatar.url" height="120px" alt="Thumbnail Image" circle class="z-depth-1"/></router-link>
          <h5 class="font-weight-bold mt-4 mb-3">{{profile.data.name[0].text}}</h5>
          <p class="text-uppercase blue-text">{{profile.data.jobtitle[0].text}}</p>
          <p class="grey-text" v-html="profile.data.jobdescription[0].text"></p>
          <ul class="list-unstyled mb-0">
            <a :href="social.url" class="p-2 fa-lg" v-for="(social, index1) in profile.socials" :key="index1">
              <mdb-icon :icon="social.smedia" class="blue-text"/>
            </a>
          </ul>
        </mdb-col>
      </mdb-row>
    </section>
  </mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbAvatar, mdbIcon } from 'mdbvue';

export default {
  name: 'TeamSection',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbAvatar,
    mdbIcon
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
.rounded-circle {
  max-width: 150px;
}
</style>
