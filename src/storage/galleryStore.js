// myArtworksStore.js
import galleryService from "@/services/galleryService";
import searchIndexService from "@/services/searchIndexService";
import _ from "lodash";

const galleryStore = {
  namespaced: true,
  state: {
    myGalleries: [],
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
    getMyGalleries: state => {
      return state.myGalleries;
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
    pushMyGallery(state, gallery) {
      let index = _.findIndex(state.myGalleries.records, function(o) {
        return o.galleryId === gallery.galleryId;
      });
      if (index === -1) {
        state.myGalleries.records.splice(0, 0, gallery);
      } else {
        state.myGalleries.records.splice(index, 1, gallery);
      }
    },
  },
  actions: {

    fetchGallery({ commit, getters, dispatch }, galleryId) {
      return new Promise(resolve => {
        let gallery = getters.getMyGallery(galleryId);
        if (gallery && gallery.shippingAddress) {
          resolve(gallery);
        } else {
          dispatch("fetchMyGalleries").then(galleries => {
            let index = _.findIndex(galleries, function(o) {
              return o.galleryId === galleryId;
            });
            galleryService.fetchGalleryUserDataFromGaia(galleries[index]).then(gallery => {
              commit("pushMyGallery", gallery);
              resolve(gallery);
            });
          });
        }
      });
    },

    fetchGalleriesFromSearch({ commit, getters, dispatch }, criteria) {
      return new Promise(resolve => {
        let domain = location.hostname;
        searchIndexService.searchDappsIndex(domain, "gallery", criteria.field, criteria.query).then(galleries => {
          _.each(galleries, function(gid) {
            let gallery = getters.getGallery(gid.owner, gid.galleryId);
            if (gallery) {
              resolve(gallery);
            } else {
              galleryService.fetchGalleryUserDataFromGaia(gid).then(gallery => {
                commit("pushUserGallery", gallery);
                resolve(gallery);
              });
            }
          });
        });
      });
    },

    fetchMyGalleries({ state, commit }) {
      return new Promise(resolve => {
        if (state.myGalleries.records && state.myGalleries.records.length > 0) {
          resolve(state.myGalleries.records);
        }
        galleryService.initGalleryData().then(galleries => {
          commit("pushMyGalleries", galleries);
          if (galleries) {
            _.forEach(galleries.records, function(galleryIndexData) {
              galleryService.fetchGalleryUserDataFromGaia(galleryIndexData).then(gallery => {
                commit("pushMyGallery", gallery);
              });
            });
            resolve(galleries.records);
          } else {
            resolve();
          }
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
