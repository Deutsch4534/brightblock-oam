import store from "@/storage/store";
import { getFile } from "blockstack";

const auctionSearchService = {
  getUserAuctions: function(username, success, failure) {
    const auctionsRootFileName = store.state.constants.auctionsRootFileName;
    getFile(auctionsRootFileName, { decrypt: false, username: username })
      .then(function(file) {
        if (file) {
          let rootFile = JSON.parse(file);
          success(rootFile.records);
        }
      })
      .catch(function() {
        failure({
          ERR_CODE: "AUCTIONS_1",
          message: "Error getting users auctions: username=" + username
        });
      });
  },

  getUsersOnlineAuction: function(username) {
    return new Promise((resolve, reject) => {
      const auctionsRootFileName = store.state.constants.auctionsRootFileName;
      getFile(auctionsRootFileName, { decrypt: false, username: username })
        .then(function(file) {
          if (file) {
            let rootFile = JSON.parse(file);
            resolve(rootFile.records);
          }
        })
        .catch(function() {
          resolve({});
          // reject(new Error({ error: "AUCTIONS_1", message: "Error get users online auction: username=" + username }));
        });
    });
  }
};
export default auctionSearchService;
