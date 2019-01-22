<template>
<div>
  <div class="md-layout md-alignment-center-right">
    <div class="md-layout-item md-size-100">
      <p>Base Search Url: : {{searchUrl}}</p>
      <p>Records: {{sizeOfIndex}}</p>
      <p><span class="text-danger" v-if="errorMessage">{{errorMessage}}</span></p>
    </div>
  </div>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <h4><a href="#" class="md-primary" @click.prevent="showClear = !showClear">Clear Indexes</a></h4>
    </div>
  </div>
  <div class="md-layout" v-if="showClear">
    <div class="md-layout-item md-size-100">
      <ul>
        <li><a href="#" class="md-primary" @click.prevent="clearNamesIndex">Clear names index</a></li>
        <li><a href="#" class="md-primary" @click.prevent="clearDappsIndex">Clear dapps index</a></li>
      </ul>
    </div>
  </div>

  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <h4><a href="#" class="md-primary" @click.prevent="showBuild1 = !showBuild1">Build Indexes</a></h4>
    </div>
  </div>
  <div class="md-layout" v-if="showBuild1">
    <div class="md-layout-item md-size-100">
      <p><a href="#" class="md-primary" @click.prevent="showBuild1 = !showBuild1">
      Build index by pages of blockstack names or by specifying specific blockstack names separated by commas.</a>
      </p>
    </div>
    <div class="md-layout-item md-size-40">
      <md-field>
        <md-input type="number" v-model="fromPage" placeholder="from page"></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-40">
      <md-field>
        <md-input type="number" v-model="toPage" placeholder="to page"></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-20">
      <md-button class="md-primary" @click.prevent="indexPages"><md-icon>thumb_up</md-icon></md-button>
    </div>
    <div class="md-layout-item md-size-80">
      <md-field>
        <md-input v-model="users" placeholder="comma separated user names"></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-20">
      <md-button class="md-primary" @click.prevent="indexUsers"><md-icon>thumb_up</md-icon></md-button>
    </div>
  </div>

  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      {{namesResults}}
    </div>
  </div>

</div>
</template>

<script>
import searchIndexService from "@/services/searchIndexService";

export default {
  name: "SearchBuilderTab",
  data() {
    return {
      showClear: false,
      showBuild1: false,
      showSearch: false,
      showBuild2: false,
      namesResults: null,
      endPoint: "/index/dapps/fetch",
      users: "brightblock.id,mike.personal.id",
      fromPage: null,
      toPage: null,
      sizeOfIndex: null,
      errorMessage: null,
      indexUsersResult: null
    };
  },
  mounted() {
    searchIndexService
      .sizeOfIndex()
      .then(result => {
        this.sizeOfIndex = result;
      })
      .catch(e => {
        console.log("Unable to contact search index.", e);
      });
  },
  computed: {
    searchUrl() {
      return process.env.VUE_APP_SEARCH_INDEX_URL;
    }
  },
  methods: {
    indexUsers: function() {
      searchIndexService
        .indexUsers(this.users)
        .then(result => {
          this.indexUsersResult = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    indexPages: function() {
      if (!this.fromPage || !this.toPage) {
        this.errorMessage =
          "Please enter the page numbers to build the index from and to.";
        return;
      }
      searchIndexService
        .indexPages(this.fromPage, this.toPage)
        .then(result => {
          this.result = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    clearDappsIndex: function() {
      searchIndexService
        .clearDappsIndex()
        .then(result => {
          this.sizeOfIndex = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    clearNamesIndex: function() {
      searchIndexService
        .clearNamesIndex()
        .then(result => {
          this.sizeOfIndex = result;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    }
  },
  components: {}
};
</script>
