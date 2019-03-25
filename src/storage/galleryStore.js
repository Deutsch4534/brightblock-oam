// myArtworksStore.js
import galleryService from "@/services/galleryService";
import searchIndexService from "@/services/searchIndexService";
import _ from "lodash";

const galleryStore = {
  namespaced: true,
  state: {
    myGalleries: {
      created: null,
      records: []
    },
    userGalleries: []
  },
  getters: {
    getGallery: state => (username, galleryId) => {
      let gallery = _.find(state.userGalleries, function(o) {
        return o.galleryId === galleryId;
      });
      return gallery;
    },
    getMyGallery: state => galleryId => {
      let gallery = _.find(state.myGalleries.records, function(o) {
        return o.galleryId === galleryId;
      });
      return gallery;
    },
    getSearchResults: state => {
      return state.userGalleries;
    }
  },
  mutations: {
    pushUserGalleries(state, userGalleries) {
      state.userGalleries = userGalleries;
    },
    pushUserGallery(state, userGallery) {
      state.userGalleries.push(userGallery);
    },
    pushMyGalleries(state, myGalleries) {
      state.myGalleries = myGalleries;
    },
    pushMyGallery(state, myGallery) {
      state.myGalleries.records.push(myGallery);
    },
  },
  actions: {

    fetchGallery({ commit, getters, dispatch }, galleryId) {
      return new Promise(resolve => {
        let gallery = getters.getMyGallery(galleryId);
        if (gallery) {
          resolve(gallery);
        } else {
          dispatch("fetchMyGalleries").then(galleries => {
            gallery = getters.getMyGallery(galleryId);
            resolve(gallery);
          });
        }
      });
    },

    fetchGalleriesFromSearch({ commit, dispatch }, criteria) {
      return new Promise(resolve => {
        let domain = location.hostname;
        searchIndexService.searchDappsIndex(domain, "gallery", criteria.field, criteria.query).then(galleries => {
          _.each(galleries, function(gid) {
            galleryService.fetchGalleryUserDataFromGaia(gid).then(gallery => {
              commit("pushUserGallery", gallery);
              //resolve(gallery);
            });
          });
        });
      });
    },

    fetchGalleriesFromUserStorage({ commit }, username) {
      return new Promise(resolve => {
        galleryService.fetchGalleriesFromGaia(username).then(galleries => {
          commit("pushUserGalleries", galleries);
          resolve(galleries);
        });
      });
    },

    fetchMyGalleries({ commit }) {
      return new Promise(resolve => {
        galleryService.initGalleryData().then(galleries => {
          commit("pushMyGalleries", galleries);
          if (galleries) {
            resolve(galleries.records);
          }
          resolve();
        });
      });
    },

    uploadOrUpdateGallery({ state, commit }, gallery) {
      return new Promise(resolve => {
        galleryService.uploadOrUpdateGallery(state.myGalleries, gallery).then(gallery => {
          commit("pushMyGallery", gallery);
          resolve(gallery);
        });
      });
    },

  }
};
export default galleryStore;
