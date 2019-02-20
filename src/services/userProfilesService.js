import {
  getFile, lookupProfile
} from "blockstack";
import store from "@/storage/store";

const userProfilesService = {
  fetchUserProfile: function(username, success, failure) {
    lookupProfile(username)
      .then(account => {
        if (account) {
          let userProfile = {
            username: username,
            name: account.name,
            description: account.description,
            avatarUrl:
              account.image && account.image.length > 0
                ? account.image[0].contentUrl
                : "",
            apps: account.apps
          };
          let domain = location.origin;
          for (var key in userProfile.apps) {
            if (key.indexOf(domain) > -1) {
              userProfile.appUrl = key;
              userProfile.gaiaUrl = userProfile.apps[key];
            }
          }
          let publicKeyDataRootFileName = store.state.constants.publicKeyDataRootFileName;
          getFile(publicKeyDataRootFileName, {username: username, decrypt: false}).then(function(file) {
            if (file) {
              userProfile.publicKeyData = JSON.parse(file);
            }
            success(userProfile);
          })
            .catch(function() {
              success(userProfile);
            });
        } else {
          failure({ error: 1, message: "Unable to find user: " + username });
        }
      })
      .catch(e => {
        console.log("lookupUserProfile: e : ", e);
        failure({ error: 2, message: "Unable to lookup user: " + username });
      });
  }
};
export default userProfilesService;
