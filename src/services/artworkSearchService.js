import searchIndexService from "@/services/searchIndexService";
import store from "@/storage/store";
import _ from "lodash";
import utils from "./utils";
import { getFile } from "blockstack";

/**
 *  The service is a client to the brightblock sever side grpc client.
 **/
const artworkSearchService = {
  newQuery(q) {
    store.commit("artworkSearchStore/clearSearchResults");
    searchIndexService.searchDappsIndex(location.hostname, "artwork", q.field, q.query).then(searchResults => {
      if (!searchResults || searchResults.error) {
        console.log(searchResults.error);
        return;
      }
      let usersToFetch = [];
      searchResults.forEach(function(searchResult) {
        // get the unique users from the search
        artworkSearchService.addUserOrNot(usersToFetch, searchResult.owner);
      });

      _.forEach(usersToFetch, function(username) {
        store.dispatch("userProfilesStore/fetchUserProfile", { username: username }, { root: true });
        const artworkRootFileName = store.state.constants.artworkRootFileName;
        // for each unique user get their root artwork file and then load the prov files matching the search
        getFile(artworkRootFileName, { decrypt: false, username: username }).then(function(file) {
          if (file) {
            let userRootFile = JSON.parse(file);
            searchResults.forEach(function(searchResult) {
              // get the unique users from the search
              artworkSearchService.storeArtwork(searchResult, userRootFile.records);
            });
          }
        });
      });
    });
  },

  storeArtwork: function(searchResult, records) {
    let artworkId = Number(searchResult.id);
    let index = _.findIndex(records, function(o) {
      return o.id === artworkId;
    });
    if (index === -1) {
      return;
    }
    let indexData = records[index];
    artworkSearchService.fetchProvenanceFile(
      indexData,
      searchResult.owner,
      function(artwork) {
        store.commit("artworkSearchStore/addSearchResult", artwork);
        store.commit("artworkSearchStore/addArtwork", artwork);
      },
      function(error) {
        console.log("Error fetching recent artworks: ", error);
      }
    );
  },

  addUserOrNot: function(usersToFetch, userId) {
    let uIndex = _.findIndex(usersToFetch, function(o) {
      return o === userId;
    });
    if (uIndex === -1) {
      usersToFetch.push(userId);
    }
  },

  userArtworks: function(data, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false, username: data.username })
      .then(function(file) {
        if (!file) {
          success();
        } else {
          let userRootFile = JSON.parse(file);
          let usersToFetch = [];
          _.forEach(userRootFile.records, function(indexData) {
            artworkSearchService.addUserOrNot(usersToFetch, indexData.uploader);
            artworkSearchService.addUserOrNot(usersToFetch, indexData.owner);
            if (data.title) {
              if (data.title === indexData.title) {
                artworkSearchService.fetchProvenanceFile(
                  indexData,
                  data.username,
                  success,
                  failure
                );
              }
            } else {
              artworkSearchService.fetchProvenanceFile(
                indexData,
                data.username,
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
          message: "Error fetching user artwork: uname=" + data.username + " title=" + data.title
        });
      });
  },

  userArtwork: function(artworkId, username, success, failure) {
    const artworkRootFileName = store.state.constants.artworkRootFileName;
    getFile(artworkRootFileName, { decrypt: false, username: username })
      .then(function(file) {
        if (!file) {
          success();
        } else {
          let userRootFile = JSON.parse(file);
          let index = _.findIndex(userRootFile.records, function(o) {
            return o.id === artworkId;
          });
          if (index > -1) {
            let indexData = userRootFile.records[index];
            artworkSearchService.fetchProvenanceFile(
              indexData,
              username,
              success,
              failure
            );
          } else {
            failure({
              ERR_CODE: 101,
              message: "Error no record for artwork id: " + artworkId + " username: " + username
            });
          }
        }
      })
      .catch(function(e) {
        failure({
          ERR_CODE: 101,
          message: "Error no record for artwork id: " + artworkId + " username: " + username + " e=" + e
        });
      });
  },

  fetchProvenanceFile: function(indexData, username, success, failure) {
    let gaiaFileName = store.state.constants.gaiaFileName;
    let fileToFetch = gaiaFileName + indexData.id + ".json";
    getFile(fileToFetch, { decrypt: false, username: username })
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
          failure({ ERR_CODE: 1, message: "no provenance file found" });
        }
      })
      .catch(function(e) {
        failure({
          ERR_CODE: 2,
          message: "Error fetching provenance file found: ",
          exception: e
        });
      });
  }
};
export default artworkSearchService;
