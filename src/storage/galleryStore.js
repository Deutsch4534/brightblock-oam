// myArtworksStore.js
import galleryService from "@/services/galleryService";
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
      let gallery = _.find(state.myGalleries, function(o) {
        return o.galleryId === galleryId;
      });
      return gallery;
    }
  },
  mutations: {
    pushUserGalleries(state, userGalleries) {
      state.userGalleries.push(userGalleries);
    },
    pushMyGalleries(state, myGalleries) {
      state.myGalleries = myGalleries;
    },
    pushMyGallery(state, myGallery) {
      state.myGalleries.records.push(myGallery);
    },
  },
  actions: {

    fetchGalleries({ commit }, data) {
      return new Promise(resolve => {
        galleryService.fetchGalleriesFromGaia(data.username).then(galleries => {
          commit("pushUserGalleries", galleries);
          resolve(galleries);
        });
      });
    },

    fetchMyGalleries({ commit }) {
      return new Promise(resolve => {
        galleryService.initGalleryData().then(galleries => {
          commit("pushMyGalleries", galleries);
          resolve(galleries);
        });
      });
    },

    uploadGallery({ commit }, gallery) {
      return new Promise(resolve => {
        galleryService.uploadGallery(gallery).then(gallery => {
          commit("pushMyGallery", gallery);
          resolve(gallery);
        });
      });
    },

  }
};
export default galleryStore;
