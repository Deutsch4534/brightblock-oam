import { getFile, putFile } from "blockstack";
import store from "@/storage/store";
import _ from "lodash";
import utils from "./utils";
import searchIndexService from "@/services/searchIndexService";
import artworkSearchService from "@/services/artworkSearchService";
import moment from "moment";
import Vue from 'vue';

const myArtworksService = {
  addSaleHistory: function(artwork, invoiceId, txid, confirmations) {
    if (!artwork.saleHistories) {
      artwork.saleHistories = [];
    }
    let sh = _.find(artwork.saleHistories, function(o) {
      return o.buyersTxid === txid;
    });
    if (!sh) {
      artwork.saleHistories.splice(0, 0, {
        seller: artwork.owner,
        buyer: artwork.buyer,
        buyersTxid: txid,
        buyersInvoiceId: invoiceId,
        confirmations: confirmations
      });
    }
  },
  addSaleHistoryPaySellerData: function(artwork, buyersTxid, sellersTxid) {
    if (!artwork.saleHistories) {
      artwork.saleHistories = [];
    }
    let sh = _.find(artwork.saleHistories, function(o) {
      return o.buyersTxid === buyersTxid;
    });
    if (!sh) {
      throw new Error("Missing sale history?");
    }
    sh.sellersTxid = sellersTxid;
  },

  initBlockstackRootFile: function() {
    const artworkRootFileName = store.state.constants.artworkRootFileName;
    var now = moment({}).valueOf();
    let newRootFile = {
      created: now,
      profile: {},
      records: []
    };
    return putFile(artworkRootFileName, JSON.stringify(newRootFile), {
      encrypt: false
    });
  },

  getMyArtworks: function(success, failure) {
    let myProfile = store.getters["myAccountStore/getMyProfile"];
    artworkSearchService.queryByOwner(myProfile.username,
      function(searchResults) {
        myArtworksService.getMyArtworksCont(searchResults, success, failure);
      },
      function(err) {
        console.log(err);
      }
    );
  },

  getMyArtworksCont: function(searchResults, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myArtworksService.initBlockstackRootFile();
        } else {
          let blockstackRootFile = JSON.parse(file);
          store.commit(
            "myArtworksStore/blockstackRootFile",
            blockstackRootFile
          );
          let usersToFetch = [];
          _.forEach(blockstackRootFile.records, function(indexData) {
            try {
              if (!indexData.uploader) {
                let userProfile = store.getters["myAccountStore/getMyProfile"];
                indexData.uploader = userProfile.username;
              }
              let searchResult = _.find(searchResults, function(o) {
                return Number(o.id) === indexData.id;
              });
              if (searchResult) {
                indexData.buyer = searchResult.buyer;
                indexData.status = searchResult.status;
              }
              myArtworksService.addUserOrNot(usersToFetch, indexData.uploader);
              myArtworksService.addUserOrNot(usersToFetch, indexData.owner);
              myArtworksService.fetchMyProvenanceFile(
                indexData,
                success,
                failure
              );
            } catch (err) {
              console.log(err);
            }
          });
          _.forEach(usersToFetch, function(userId) {
            store.dispatch("userProfilesStore/fetchUserProfile", { username: userId }, { root: true });
          });
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 101,
          message: "Error getting my artworks: artworkRootFileName=" + artworkRootFileName
        });
      });
  },

  addUserOrNot: function(usersToFetch, userId) {
    let uIndex = _.findIndex(usersToFetch, function(o) {
      return o === userId;
    });
    if (uIndex === -1) {
      usersToFetch.push(userId);
    }
  },

  getMyArtwork: function(artworkId, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myArtworksService.initBlockstackRootFile();
        } else {
          let blockstackRootFile = JSON.parse(file);
          store.commit(
            "myArtworksStore/blockstackRootFile",
            blockstackRootFile
          );
          let usersToFetch = [];
          _.forEach(blockstackRootFile.records, function(indexData) {
            if (indexData.id === artworkId) {
              myArtworksService.addUserOrNot(usersToFetch, indexData.uploader);
              myArtworksService.addUserOrNot(usersToFetch, indexData.owner);
              myArtworksService.fetchMyProvenanceFile(
                indexData,
                success,
                failure
              );
            }
          });
          _.forEach(usersToFetch, function(userId) {
            store.dispatch("userProfilesStore/fetchUserProfile", { username: userId }, { root: true });
          });
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 101,
          message: "Error getting my artwork: artworkRootFileName=" + artworkRootFileName + " artworkId=" + artworkId
        });
      });
  },

  transferArtwork: function(artwork, success, failure) {
    /**
    searchIndexService.removeRecord("id", artwork.id).then(function(message) {
      notify.info({
        title: "Transfer Artwork.",
        text: "Removed from search index <br>" + message
      });
      myArtworksService.uploadOrTransferArtwork(artwork, success, failure);
    });
    **/
    myArtworksService.uploadOrTransferArtwork(artwork, success, failure);
  },

  uploadArtwork: function(artwork, success, failure) {
    artwork.id = moment({}).valueOf();
    artwork.lastUpdate = artwork.id;
    artwork.bcitem = {
      status: "new",
      itemIndex: -1
    };
    let timestamp = (artwork.timestamp) ? artwork.timestamp : utils.buildArtworkHashFromArtwork(artwork);
    let sameArtwork = store.getters["myArtworksStore/myArtworkByTimestamp"](timestamp);
    if (!sameArtwork) {
      myArtworksService.uploadOrTransferArtwork(artwork, success, failure);
    } else {
      Vue.notify({
        title: 'Error Uploading Artwork',
        text: 'Artwork has already been uploaded!',
        type: 'warn'
      });
    }
  },

  uploadOrTransferArtwork: function(artwork, success, failure) {
    let artworkRootFileName = store.state.constants.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          myArtworksService.initBlockstackRootFile().then(function(file) {
            myArtworksService.uploadProvenanceFile(artworkRootFileName,file,artwork,success,failure);
          });
        } else {
          myArtworksService.uploadProvenanceFile(artworkRootFileName,file,artwork,success,failure);
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: 2,
          message:
            "no root blockstack fole found for file name: " +
            artworkRootFileName
        });
      });
  },

  uploadProvenanceFile: function(
    artworkRootFileName,
    file,
    artwork,
    success,
    failure
  ) {
    let blockstackRootFile = file;
    if (typeof file === "string") {
      blockstackRootFile = JSON.parse(file);
    }
    let gaiaFileName = store.state.constants.gaiaFileName;
    let provFile = gaiaFileName + artwork.id + ".json";
    let record = utils.convertToBlockstack(artwork);
    let index = _.findIndex(blockstackRootFile.records, function(o) {
      return o.id === artwork.id;
    });
    if (index < 0) {
      blockstackRootFile.records.splice(0, 0, record.indexData);
    } else {
      blockstackRootFile.records.splice(index, 1, record.indexData);
    }
    putFile(artworkRootFileName, JSON.stringify(blockstackRootFile), {
      encrypt: false
    })
      .then(function() {
        putFile(provFile, JSON.stringify(record.provData), { encrypt: false })
          .then(function() {
            store.commit(
              "myArtworksStore/blockstackRootFile",
              blockstackRootFile
            );
            searchIndexService.addRecord("artwork", record.indexData);
            // searchIndexService.indexUsers(record.indexData.owner);
            success(utils.convertFromBlockstack(record));
          })
          .catch(function() {
            failure({
              ERR_CODE: 2,
              message: "Error saving provenance file: " + artwork.id
            });
          });
      })
      .catch(function() {
        failure({
          ERR_CODE: 3,
          message: "Error uploading artwork: " + artwork.id
        });
      });
  },

  updateArtwork: function(artwork, success, failure) {
    let artworkRootFileName = store.state.constants.artworkRootFileName;
    let gaiaFileName = store.state.constants.gaiaFileName;
    let provFile = gaiaFileName + artwork.id + ".json";
    var now = moment({}).valueOf();
    artwork.lastUpdate = now;
    if (!artwork.bcitem) {
      // for backwards compat with items created before this object was added.
      artwork.bcitem = {
        status: "new",
        itemIndex: -1
      };
    }
    searchIndexService.removeRecord("id", artwork.id).then(function() {
      let record = utils.convertToBlockstack(artwork);
      getFile(artworkRootFileName, { decrypt: false })
        .then(function(file) {
          if (!file) {
            failure({ ERR_CODE: 1, message: "no artworks found" });
          } else {
            let blockstackRootFile = JSON.parse(file);
            let index = _.findIndex(blockstackRootFile.records, function(o) {
              return o.id === artwork.id;
            });
            if (index < 0 || index >= blockstackRootFile.records.length) {
              failure({
                ERR_CODE: 2,
                message: "Unable to find index data in record."
              });
            } else {
              blockstackRootFile.records[index] = record.indexData;
              putFile(artworkRootFileName, JSON.stringify(blockstackRootFile), {
                encrypt: false
              })
                .then(function() {
                  putFile(provFile, JSON.stringify(record.provData), {
                    encrypt: false
                  })
                    .then(function() {
                      store.commit(
                        "myArtworksStore/blockstackRootFile",
                        blockstackRootFile
                      );
                      success(utils.convertFromBlockstack(record));
                      // searchIndexService.indexUsers(record.indexData.owner);
                      searchIndexService.addRecord("artwork", record.indexData);
                    })
                    .catch(function() {
                      failure({
                        ERR_CODE: 3,
                        message: "Error saving provenance file: " + artwork.id
                      });
                    });
                })
                .catch(function() {
                  failure({
                    ERR_CODE: 4,
                    message: "Error uploading artwork: " + artwork.id
                  });
                });
            }
          }
        })
        .catch(function() {
          failure({ ERR_CODE: 5, message: "no artworks found" });
        });
    });
  },

  fetchMyProvenanceFile: function(indexData, success, failure) {
    let gaiaFileName = store.state.constants.gaiaFileName;
    let fileToFetch = gaiaFileName + indexData.id + ".json";
    getFile(fileToFetch, { decrypt: false })
      .then(function(file) {
        if (file) {
          try {
            let provData = JSON.parse(file);
            provData.id = indexData.id;
            success(
              utils.convertFromBlockstack({
                indexData: indexData,
                provData: provData
              })
            );
          } catch (err) {
            console.error("Corrupt json file - skipping! file: " + file, err);
          }
        } else {
          success(
            utils.convertFromBlockstack({
              indexData: indexData,
              provData: {}
            })
          );
        }
      })
      .catch(function(e) {
        failure({
          ERR_CODE: 2,
          message: "Error fetching provenance file found: ",
          exception: e
        });
      });
  },

  deleteMyArtwork: function(id, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName;
    const gaiaFileName = store.state.constants.gaiaFileName;
    getFile(artworkRootFileName, { decrypt: false })
      .then(function(file) {
        if (!file) {
          failure({
            ERR_CODE: 1,
            message: "No artworks found to delete from: " + id
          });
        } else {
          let blockstackRootFile = JSON.parse(file);
          console.log(
            "blockstackRootFile length before: " +
              blockstackRootFile.records.length
          );
          let index = _.findIndex(blockstackRootFile.records, function(o) {
            return o.id === id;
          });
          if (index < 0) {
            failure({
              ERR_CODE: 2,
              message: "no artwork in blockstack root file: " + id
            });
            return;
          }
          let artwork = blockstackRootFile.records[index];
          if (artwork.saleData.auctionId) {
            failure({
              ERR_CODE: 3,
              message:
                "This artwork is listed in auction: " +
                artwork.saleData.auctionId +
                " please remember to remove it.."
            });
            return;
          }
          let deletedRecord = blockstackRootFile.records.splice(index, 1);
          console.log(
            "blockstackRootFile length after: " +
              blockstackRootFile.records.length +
              " index=" +
              index
          );
          let fileToDelete = gaiaFileName + id + ".json";
          putFile(
            fileToDelete,
            JSON.stringify({ deleted: true, reason: "deleted by user" }),
            { encrypt: false }
          )
            .then(function() {
              putFile(artworkRootFileName, JSON.stringify(blockstackRootFile), {
                encrypt: false
              })
                .then(function() {
                  searchIndexService.removeRecord("id", id);
                  store.commit(
                    "myArtworksStore/blockstackRootFile",
                    blockstackRootFile
                  );
                  success({
                    id: id,
                    title: deletedRecord.title,
                    message: "Removed from user storage and the search index."
                  });
                })
                .catch(function(e) {
                  console.log(
                    "Unable to create provenance record in user gaia storage: ",
                    e
                  );
                  failure({
                    ERR_CODE: 3,
                    message: "Error saving updated blockstack root file: " + id
                  });
                });
            })
            .catch(function() {
              failure({
                ERR_CODE: 4,
                message: "Error trying to delete: " + id
              });
            });
        }
      })
      .catch(function() {
        failure({ ERR_CODE: 5, message: "no artworks found" });
      });
  }
};
export default myArtworksService;
