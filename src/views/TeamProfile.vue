<template>
      <div class="section profile-content">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-50 mx-auto">
              <div class="profile">
                <div class="avatar">
                  <img :src="profile.data.avatar.url" alt="Circle Image" class="img-raised rounded-circle img-fluid">
                </div>
                <div class="name">
                  <h3 class="title">{{profile.data.name[0].text}}</h3>
                  <h6>{{profile.data.jobtitle[0].text}}</h6>
                  <md-button href="javascript:void(0)" class="md-just-icon md-simple md-dribbble"><i class="fab fa-dribbble"></i></md-button>
                  <md-button href="javascript:void(0)" class="md-just-icon md-simple md-twitter"><i class="fab fa-twitter"></i></md-button>
                  <md-button href="javascript:void(0)" class="md-just-icon md-simple md-pinterest"><i class="fab fa-pinterest"></i></md-button>
                </div>
              </div>
            </div>
          </div>
          <div class="description text-center">
            <p>{{profile.data.jobdescription[0].text}}</p>
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
</template>

<script>
// import { Tabs } from "@/components";
export default {
  components: {},
  bodyClass: "profile-page",
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
      ]
    };
  },
  props: {
    header: {
      type: String,
      default: require("@/assets/img/city-profile.jpg")
    },
    img: {
      type: String,
      default: require("@/assets/img/faces/christian.jpg")
    }
  },
  mounted() {
    this.profileId = this.$route.params.profileId;
    let profile = this.$store.getters["userProfilesStore/getTeamProfile"](
      this.profileId
    );
    if (!profile.id) {
      let $self = this;
      this.$prismic.client.getByID(this.profileId).then(function(profile) {
        $self.$store.commit("userProfilesStore/addTeamProfile", profile);
      });
    }
  },
  computed: {
    profile() {
      return this.$store.getters["userProfilesStore/getTeamProfile"](
        this.profileId
      );
    }
  }
};
</script>

<style scoped>
.section {
  padding: 0;
}

.profile-tabs /deep/ {
  .md-card-tabs .md-list {
    justify-content: center;
  }

  [class*="tab-pane-"] {
    margin-top: 3.213rem;
    padding-bottom: 50px;

    img {
      margin-bottom: 2.142rem;
    }
  }
}
</style>
