import axios from "axios";
import {
  Person,
  loadUserData,
  handlePendingSignIn,
  isSignInPending,
  isUserSignedIn,
  hexStringToECPair,
  redirectToSignIn,
  decodeToken,
  encryptContent,
  signUserOut, getFile, putFile
} from "blockstack";
import store from "@/storage/store";
import moment from "moment";
import userProfilesService from "@/services/userProfilesService";
import _ from "lodash";

const myAccountService = {
  myProfile: function() {
    let myProfile = {
      loggedIn: false
    };
    let account = loadUserData();
    if (account) {
      let uname = account.username;
      let person = new Person(account.profile);
      let name = person.name();
      if (uname) {
        if (!name) {
          let indexOfDot = uname.indexOf(".");
          name = uname.substring(0, indexOfDot);
        }
      }
      if (!uname && name) {
        uname = name;
      }
      let showAdmin =
        uname === "mike.personal.id" ||
        uname.indexOf("brightblock") > -1 ||
        uname.indexOf("sybellaio") > -1 ||
        uname.indexOf("rosemarry") > -1 ||
        uname.indexOf("anton") > -1;
      let avatarUrl = person.avatarUrl();
      if (!avatarUrl) {
        avatarUrl =  require("@/assets/img/missing/anonuser3.png");
      }
      let privateKey = account.appPrivateKey + "01";
      privateKey = hexStringToECPair(privateKey).toWIF();
      var authResponseToken = account.authResponseToken;
      var decodedToken = decodeToken(authResponseToken);
      var publicKey = decodedToken.payload.public_keys[0];

      myProfile = {
        loggedIn: true,
        identityAddress: account.identityAddress,
        publicKey: publicKey,
        appPrivateKey: privateKey,
        showAdmin: showAdmin,
        name: name,
        description: person.description(),
        avatarUrl: avatarUrl,
        username: uname,
        hubUrl: account.hubUrl,
        apps: account.profile.apps
      };
    }
    return myProfile;
  },
  handlePending: function() {
    handlePendingSignIn().then(function() {
      store.dispatch("myAccountStore/fetchMyAccount");
    });
  },
  isPending: function() {
    return isSignInPending();
  },
  canLogIn: function() {
    return new Promise(resolve => {
      axios
        .get("http://localhost:6270/v1/ping")
        .then(response => {
          resolve(response.data.status === "alive");
        })
        .catch(e => {
          console.log("No one listening on 6270?", e);
          resolve(true);
        });
    });
  },
  isLoggedIn: function() {
    if (isUserSignedIn()) {
      //store.dispatch("myAccountStore/fetchMyAccount");
      return true;
    } else if (isSignInPending()) {
      myAccountService.handlePending();
      return true;
    } else {
      return false;
    }
  },
  logout: function() {
    signUserOut(window.location.origin);
    store.dispatch("myAccountStore/fetchMyAccount");
  },
  loginMultiPlayer: function() {
    if (!this.isLoggedIn()) {
      const origin = window.location.origin;
      redirectToSignIn(origin, origin + "/manifest.json", [
        "store_write",
        "publish_data"
      ]);
    }
  },
  login: function() {
    if (!this.isLoggedIn()) {
      redirectToSignIn();
      store.dispatch("myAccountStore/fetchMyAccount");
    }
  },
  updateAuxiliaryProfile: function(auxiliaryProfile, success, failure) {
    let auxiliaryProfileRootFileName = store.state.constants.auxiliaryProfileRootFileName;
    putFile(auxiliaryProfileRootFileName, JSON.stringify(auxiliaryProfile), {encrypt: true})
      .then(function() {
        success(auxiliaryProfile);
      })
      .catch(function() {
        failure({ERR_CODE: 4, message: "Error uploading aux profile."});
      });
  },
  updatePublicKeyData: function(publicKeyData, success, failure) {
    // check for trusted ids for whom we want to encrypt our private data with their public key.
    let publicKeyDataRootFileName = store.state.constants.publicKeyDataRootFileName;
    let myProfile = store.getters["myAccountStore/getMyProfile"];
    let auxiliaryProfile = myProfile.auxiliaryProfile;
    publicKeyData.publicBlockstackKey = myProfile.publicKey;
    if (auxiliaryProfile.trustedIds) {
      let trustedIds = auxiliaryProfile.trustedIds.split(",");
      _.forEach(trustedIds, function(trustedId) {
        // fetch the users publicKeyData file - we need their pub key to encrypt our address!!!
        let username = trustedId.trim();
        userProfilesService.fetchUserProfile(username, function (userProfile) {
          if (userProfile.publicKeyData && userProfile.publicKeyData.publicBlockstackKey) {
            let pubkey = userProfile.publicKeyData.publicBlockstackKey;
            publicKeyData.secured = [];
            let encObj = {
              username: username
            };
            if (auxiliaryProfile.emailAddress) {
              encObj.emailAddress = encryptContent(auxiliaryProfile.emailAddress, pubkey);
            }
            if (auxiliaryProfile.shippingAddress) {
              encObj.shippingAddress = encryptContent(JSON.stringify(auxiliaryProfile.shippingAddress), pubkey);
            }
            publicKeyData.secured.push(encObj);
          }
          putFile(publicKeyDataRootFileName, JSON.stringify(publicKeyData), {encrypt: false}).then(() => {
            success(publicKeyData);
          });
        });
      });
    } else {
      putFile(publicKeyDataRootFileName, JSON.stringify(publicKeyData), {encrypt: false}).then(() => {
        success(publicKeyData);
      });
    }
  },
  getAuxiliaryProfile: function(success, failure) {
    // let myProfile = store.getters["myAccountStore/getMyProfile"];
    let auxiliaryProfileRootFileName = store.state.constants.auxiliaryProfileRootFileName;
    let auxiliaryProfile = {};
    let newRootFile = {
      created: moment({}).valueOf(),
    };
    getFile(auxiliaryProfileRootFileName, { decrypt: true }).then(function(file) {
      if (file) {
        auxiliaryProfile = JSON.parse(file);
        success(auxiliaryProfile);
      } else {
        putFile(auxiliaryProfileRootFileName, JSON.stringify(newRootFile), {encrypt: true}).then(function(file) {
          success(newRootFile);
        });
      }
    })
      .catch(function(err) {
        putFile(auxiliaryProfileRootFileName, JSON.stringify(newRootFile), {encrypt: true}).then(function(file) {
          success(newRootFile);
        });
        console.log(err);
        // failure({ ERR_CODE: 5, message: "no auxiliaryProfile found: " + err });
      });
  },
  getPublicKeyData: function(myProfile, success, failure) {
    let publicKeyDataRootFileName = store.state.constants.publicKeyDataRootFileName;
    getFile(publicKeyDataRootFileName, { decrypt: false }).then(function(file) {
      if (!file) {
        let newRootFile = {
          created: moment({}).valueOf(),
          bitcoinAddress: (myProfile.auxiliaryProfile) ? myProfile.auxiliaryProfile.bitcoinAddress : null,
          publicBlockstackKey: myProfile.publicKey
        };
        putFile(publicKeyDataRootFileName, JSON.stringify(newRootFile), {encrypt: false}).then(function(file) {
          success(newRootFile);
        });
      } else {
        success(JSON.parse(file));
      }
    });
  }
};
export default myAccountService;
