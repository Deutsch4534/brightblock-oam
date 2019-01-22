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
      <h4><a href="#" class="md-primary" @click.prevent="showSearch = 0">Search Options</a></h4>
      <ul>
        <li><a href="#" class="md-primary" @click.prevent="showSearch = 1">User Search</a></li>
        <li><a href="#" class="md-primary" @click.prevent="showSearch = 2">Dapps Search</a></li>
      </ul>
    </div>
  </div>

  <div class="md-layout" v-if="showSearch === 1">
    <div class="md-layout-item md-size-100">
      <p><a href="#" class="md-primary" @click.prevent="fetchAllNamesIndex">fetch all user records</a></p>
      <p><a href="https://search.brightblock.org/index/dapps/staging.transit8.com/artwork/title?q=*" class="md-primary">e.g. {{searchUrl}}/index/dapps/staging.transit8.com/artwork/title?q=*</a></p>
      <p><a href="#" class="md-primary">{{searchUrl}}/index/names/query/{{queryNamesTerm}}?q={{queryStringNames}}</a></p>
    </div>
    <div class="md-layout-item md-size-30">
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger class="md-success"><md-icon>search</md-icon> {{queryNamesTerm}}</md-button>
        <md-menu-content>
          <md-menu-item @click="queryNamesTerm = 'name'">name</md-menu-item>
          <md-menu-item @click="queryNamesTerm = 'description'">description</md-menu-item>
          <md-menu-item @click="queryNamesTerm = 'zonefile'">zonefile</md-menu-item>
          <md-menu-item @click="queryNamesTerm = 'apps'">apps</md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
    <div class="md-layout-item md-size-50">
      <md-field>
        <md-input placeholder="enter query" v-model="queryStringNames"></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-20">
      <md-button class="md-primary" @click.prevent="searchNamesIndex"><md-icon>thumb_up</md-icon></md-button>
    </div>
  </div>

  <div class="md-layout" v-if="showSearch === 2">
    <div class="md-layout-item md-size-100">
      <p><a href="#" class="md-primary" @click.prevent="fetchAllDappsIndex">Fetch all app records</a></p>
      <p><a href="#" class="md-primary">{{searchUrl}}/index/dapps/{{domain}}/{{objType}}/title?q={{queryStringDapps}}</a></p>
    </div>
    <div class="md-layout-item md-size-20">
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger class="md-success">{{objType}}</md-button>
        <md-menu-content>
          <md-menu-item @click="objType = 'artwork'">artwork</md-menu-item>
          <md-menu-item @click="objType = 'auction'">auction</md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
    <div class="md-layout-item md-size-20">
      <md-menu md-size="medium" md-align-trigger>
        <md-button md-menu-trigger class="md-success">{{queryDappsTerm}}</md-button>
        <md-menu-content>
          <md-menu-item @click="queryDappsTerm = 'title'">title</md-menu-item>
          <md-menu-item @click="queryDappsTerm = 'description'">description</md-menu-item>
          <md-menu-item @click="queryDappsTerm = 'keywords'">keywords</md-menu-item>
          <md-menu-item @click="queryDappsTerm = 'owner'">owner</md-menu-item>
          <md-menu-item @click="queryDappsTerm = 'domain'">domain</md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
    <div class="md-layout-item md-size-40">
      <md-field>
        <md-input placeholder="enter query" v-model="queryStringDapps"></md-input>
      </md-field>
    </div>
    <div class="md-layout-item md-size-20">
      <md-button class="md-primary" @click.prevent="searchDappsIndex"><md-icon>thumb_up</md-icon></md-button>
    </div>
  </div>


  <div class="md-layout" v-if="namesResults.length > 0">
    <div class="md-layout-item md-size-100">
      <p><small>Found: {{ namesResults.length }}  </small></p>
      <div v-for="(result, index) in namesResults" :key="index" style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc">
        <div class="md-layout"><div class="md-layout-item md-size-25">name:</div> <div class="md-layout-item md-size-75">{{ result.name }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">description:</div> <div class="md-layout-item md-size-75">{{ result.description }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">apps:</div> <div class="md-layout-item md-size-75">{{ result.apps }}</div></div>
        <!--
        <div class="md-layout"><div class="md-layout-item md-size-25">zonefile_hash:</div> <div class="md-layout-item md-size-75">{{ result.zonefile_hash }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">last_txid:</div> <div class="md-layout-item md-size-75">{{ result.last_txid }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">status:</div> <div class="md-layout-item md-size-75">{{ result.status }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">zonefile:</div> <div class="md-layout-item md-size-75">{{ result.zonefile }}</div></div>
        -->
      </div>
    </div>
  </div>
  <div class="md-layout" v-if="dappsResults.length > 0">
    <div class="md-layout-item md-size-100">
      <p><small>Found: {{ dappsResults.length }}  </small></p>
      <div v-for="(result, index) in dappsResults" :key="index" style="padding: 10px; margin-bottom: 30px; border-radius: 10px; border: 1pt solid #ccc">
        <div class="md-layout"><div class="md-layout-item md-size-25">id:</div> <div class="md-layout-item md-size-75">{{ result.id }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">domain:</div> <div class="md-layout-item md-size-75">{{ result.domain }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">title:</div> <div class="md-layout-item md-size-75">{{ result.title }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">description:</div> <div class="md-layout-item md-size-75">{{ result.description }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">owner:</div> <div class="md-layout-item md-size-75">{{ result.owner }}</div></div>
        <div class="md-layout"><div class="md-layout-item md-size-25">keywords:</div> <div class="md-layout-item md-size-75">{{ result.keywords }}</div></div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import searchIndexService from "@/services/searchIndexService";

export default {
  name: "SearchDappsTab",
  data() {
    return {
      showFetch: false,
      showSearch: 0,
      dappsResults: [],
      namesResults: [],
      sizeOfIndex: null,
      errorMessage: null,
      queryStringNames: null,
      queryNamesTerm: "name",
      queryDappsTerm: "title",
      queryStringDapps: null,
      endPoint: "/index/dapps/staging.transit8.com/artwork/title?q=*",
      objType: "artwork"
    };
  },
  computed: {
    searchUrl() {
      return process.env.VUE_APP_SEARCH_INDEX_URL;
    },
    domain() {
      return location.hostname;
    }
  },
  mounted() {
    searchIndexService
      .sizeOfIndex("dapps")
      .then(result => {
        this.sizeOfIndex = result;
      })
      .catch(e => {
        console.log("Unable to contact search index.", e);
      });
  },
  methods: {
    searchDappsIndex: function() {
      if (!this.queryStringDapps) {
        this.queryStringDapps = "*";
      }
      this.dappsResults = [];
      this.namesResults = [];
      searchIndexService
        .searchDappsIndex(
          this.objType,
          this.queryDappsTerm,
          this.queryStringDapps
        )
        .then(dappsResults => {
          this.dappsResults = dappsResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    fetchAllDappsIndex: function() {
      this.dappsResults = [];
      this.namesResults = [];
      searchIndexService
        .fetchAllDappsIndex(this.queryDappsTerm, this.queryString)
        .then(dappsResults => {
          this.dappsResults = dappsResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    searchNamesIndex: function() {
      if (!this.queryStringNames) {
        this.queryStringNames = "*";
      }
      this.dappsResults = [];
      this.namesResults = [];
      searchIndexService
        .searchNamesIndex(this.queryNamesTerm, this.queryStringNames)
        .then(namesResults => {
          this.namesResults = namesResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    },

    fetchAllNamesIndex: function() {
      this.dappsResults = [];
      this.namesResults = [];
      searchIndexService
        .fetchAllNamesIndex(this.queryNamesTerm, this.queryString)
        .then(namesResults => {
          this.namesResults = namesResults;
        })
        .catch(e => {
          console.log("Unable to contact search index.", e);
        });
    }
  },
  components: {}
};
</script>
