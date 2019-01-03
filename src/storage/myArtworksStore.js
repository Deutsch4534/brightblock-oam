// myArtworksStore.js
import myArtworksService from "@/services/myArtworksService";
import _ from "lodash";
import notify from "@/services/notify";
import store from "@/storage/store";
import moneyUtils from "@/services/moneyUtils";
import myAccountService from "@/services/myAccountService";

const myArtworksStore = {
  namespaced: true,
  state: {
    myArtworks: [],
    blockstackRootFile: {}
  },
  getters: {
    bcstatus: (state, getters) => id => {
      let artwork = getters.myArtwork(id);
      if (!artwork.bcitem || artwork.bcitem.itemIndex < 0) {
        artwork.bcitem = {
          status: "new",
          itemIndex: -1
        };
      }
      return artwork.bcitem.status;
    },
    canSell: (state, getters) => id => {
      let artwork = getters.myArtwork(id);
      let username = store.getters["myAccountStore/getMyProfile"].username;
      return (
        artwork.bcitem &&
        artwork.bcitem.itemIndex >= 0 &&
        artwork.owner === username
      );
    },
    canRegister: (state, getters) => id => {
      let artwork = getters.myArtwork(id);
      if (artwork.bcitem && artwork.bcitem.itemIndex >= 0) {
        return false;
      }
      return true;
    },
    numberArtworksSold: (state, getters) => {
      return getters.sold.length;
    },
    numberArtworksUnsold: (state, getters) => {
      return getters.unsold.length;
    },
    editable: (state, getters) => id => {
      let artwork = getters.myArtwork(id);
      let userProfile = store.getters["myAccountStore/getMyProfile"];
      return userProfile.username === artwork.owner;
    },
    myArtworkOrDefault: (state, getters) => id => {
      let artwork = getters.myArtwork(id);
      if (!artwork) {
        artwork = {
          itemType: "digiart",
          keywords: "Photography,Illustration.3D,2D,Film & Video,Mix-media",
          artist: "unknown",
          owner: "unknown",
          saleData: {},
          editions: 1,
          images: [],
          supportingDocuments: [],
          artwork: []
        };
        let user = myAccountService.myProfile();
        if (user) {
          artwork.uploader = user.username;
          artwork.owner = user.username;
          artwork.artist = user.username;
        }
      }
      return artwork;
    },
    myArtwork: state => id => {
      let artwork;
      if (id) {
        let artworks = state.myArtworks.filter(
          myArtwork => myArtwork.id === id
        );
        if (artworks && artworks.length > 0) {
          artwork = artworks[0];
        }
      }
      return artwork;
    },
    unsold: state => {
      let username = store.getters["myAccountStore/getMyProfile"].username;
      return state.myArtworks.filter(artwork => username === artwork.owner);
    },
    sold: state => {
      let username = store.getters["myAccountStore/getMyProfile"].username;
      return state.myArtworks.filter(artwork => username !== artwork.owner);
    },
    auctioning: state => auctionId => {
      return state.myArtworks.filter(
        artwork => auctionId === artwork.saleData.auctionId
      );
    },
    available: state => auctionId => {
      // let available = state.myArtworks.filter(artwork => typeof (artwork.saleData.auctionId) === 'undefined')
      let zerro = state.myArtworks.filter(
        artwork =>
          typeof artwork.saleData.auctionId === "undefined" ||
          artwork.saleData.auctionId === 0 ||
          artwork.saleData.auctionId !== auctionId
      );
      return zerro;
    }
  },
  mutations: {
    blockstackRootFile(state, blockstackRootFile) {
      state.blockstackRootFile = blockstackRootFile;
    },
    myArtworks(state, myArtworks) {
      state.myArtworks = myArtworks;
    },
    addMyArtwork(state, myArtwork) {
      let index = _.findIndex(state.myArtworks, function(o) {
        return o.id === myArtwork.id;
      });
      if (index === -1) {
        state.myArtworks.splice(0, 0, myArtwork);
      } else {
        state.myArtworks.splice(index, 1, myArtwork);
      }
    }
  },
  actions: {
    addToAuction({ commit }, artwork) {
      return new Promise((resolve, reject) => {
        store
          .dispatch("myAuctionsStore/addItem", artwork)
          .then(() => {
            notify.debug({
              title: "Sell Via Auction",
              text: "Item info added to auction."
            });
            store
              .dispatch("myArtworksStore/updateArtwork", artwork)
              .then(artwork => {
                notify.debug({
                  title: "Sell Via Auction",
                  text: "Auction info added to artwork."
                });
                commit("addMyArtwork", artwork);
                resolve(artwork);
              })
              .catch(e => {
                reject(e);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    removeFromAuction({ state }, data) {
      return new Promise((resolve, reject) => {
        let artwork = state.myArtworks.filter(
          myArtwork => myArtwork.id === data.itemId
        )[0];
        store
          .dispatch("myAuctionsStore/removeItem", {
            itemId: data.itemId,
            auctionId: data.auctionId
          })
          .then(() => {
            notify.debug({
              title: "Sell Via Auction",
              text: "Item info removed from auction."
            });
            if (artwork) {
              artwork.saleData = moneyUtils.buildInitialSaleData();
              store
                .dispatch("myArtworksStore/updateArtwork", artwork)
                .then(artwork => {
                  notify.debug({
                    title: "Sell Via Auction",
                    text: "Auction info removed from artwork."
                  });
                  resolve(artwork);
                })
                .catch(e => {
                  notify.debug({
                    title: "Sell Via Auction",
                    text: "No artwork."
                  });
                  reject(e);
                });
            } else {
              resolve({});
            }
          })
          .catch(e => {
            reject(e);
          });
      });
    },
    deleteMyArtwork({ commit, state }, id) {
      myArtworksService.deleteMyArtwork(
        id,
        function(result) {
          let myArtworks = state.myArtworks;
          let index = _.findIndex(myArtworks, function(o) {
            return o.id === result.id;
          });
          myArtworks.splice(index, 1);
          commit("myArtworks", myArtworks);
          notify.info({ title: "Delete File.", text: result.message });
        },
        function(error) {
          notify.error({
            title: "Delete File.",
            text: "Error deleting your file: <br>" + error.message
          });
          console.log("Error deleting artwork.", error);
        }
      );
    },
    fetchMyArtworks({ commit }) {
      myArtworksService.getMyArtworks(
        function(myArtwork) {
          commit("addMyArtwork", myArtwork);
          store
            .dispatch(
              "ethStore/fetchBlockchainItem",
              { timestamp: myArtwork.timestamp },
              { root: true }
            )
            .then(blockchainItem => {
              if (blockchainItem && blockchainItem.itemIndex > -1) {
                if (!myArtwork.bcitem) {
                  myArtwork.bcitem = {};
                }
                myArtwork.bcitem.status = "registered";
                moneyUtils.convertPrices(myArtwork, blockchainItem);
                if (myArtwork.owner !== blockchainItem.blockstackId) {
                  myArtwork.owner = blockchainItem.blockstackId;
                  store.dispatch("myArtworksStore/updateArtwork", myArtwork);
                }
                commit("addMyArtwork", myArtwork);
              } else {
                myArtwork.bcitem = {
                  status: "new",
                  itemIndex: -1
                };
              }
            });
        },
        function(error) {
          console.log("Error fetching artworks", error);
        }
      );
    },
    fetchMyArtwork({ commit }, artworkId) {
      return new Promise(resolve => {
        myArtworksService.getMyArtwork(
          artworkId,
          function(myArtwork) {
            let blockchainItem = store.getters["ethStore/getBlockchainItem"](
              myArtwork.timestamp
            );
            myArtwork.blockchainItem = blockchainItem;
            moneyUtils.convertPrices(myArtwork, blockchainItem);
            if (myArtwork.owner !== blockchainItem.blockstackId) {
              myArtwork.owner = blockchainItem.blockstackId;
              store.dispatch("myArtworksStore/updateArtwork", myArtwork);
            }
            commit("addMyArtwork", myArtwork);
            resolve(myArtwork);
          },
          function(error) {
            console.log("Error fetching artwork: " + artworkId, error);
            resolve();
          }
        );
      });
    },

    uploadArtwork({ commit }, artwork) {
      return new Promise(resolve => {
        myArtworksService.uploadArtwork(
          artwork,
          function(artwork) {
            commit("addMyArtwork", artwork);
            resolve(artwork);
          },
          function(error) {
            console.log("Error uploading artwork: ", error);
            resolve();
          }
        );
      });
    },

    transferArtwork({ commit }, artwork) {
      return new Promise(resolve => {
        myArtworksService.transferArtwork(
          artwork,
          function(artwork) {
            commit("addMyArtwork", artwork);
            resolve(artwork);
          },
          function(error) {
            console.log("Error uploading artwork: ", error);
            resolve();
          }
        );
      });
    },

    syncBlockchainState({ commit }, artwork) {
      return new Promise(resolve => {
        let count = 0;
        if (!artwork || !artwork.timestamp) {
          resolve({});
          return;
        }
        let intval = setInterval(function() {
          store
            .dispatch("ethStore/fetchBlockchainItem", {
              timestamp: artwork.timestamp
            })
            .then(blockchainItem => {
              if (
                blockchainItem &&
                artwork.bcitem.price === blockchainItem.price
              ) {
                clearInterval(intval);
              }
              if (count >= 5) {
                clearInterval(intval);
              }
              if (blockchainItem) {
                moneyUtils.convertPrices(artwork, blockchainItem);
                commit("addMyArtwork", artwork);
                resolve(artwork);
                notify.info({
                  title: "Blockchain Artwork Sync",
                  text: "New price has been set in blockchain."
                });
              }
              count++;
            });
        }, 2000);
      });
    },

    updateArtwork({ commit }, artwork) {
      return new Promise(resolve => {
        myArtworksService.updateArtwork(
          artwork,
          function(artwork) {
            commit("addMyArtwork", artwork);
            store
              .dispatch("ethStore/fetchBlockchainItem", {
                timestamp: artwork.timestamp
              })
              .then(blockchainItem => {
                if (blockchainItem) {
                  moneyUtils.convertPrices(artwork, blockchainItem);
                  commit("addMyArtwork", artwork);
                  notify.info({
                    title: "Update Artwork",
                    text: "New price has been set in blockchain."
                  });
                }
                resolve(artwork);
              });
          },
          function(error) {
            console.log("Error uploading artwork: ", error);
            resolve();
          }
        );
      });
    }
  }
};
export default myArtworksStore;
