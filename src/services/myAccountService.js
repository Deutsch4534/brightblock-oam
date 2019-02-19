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
  signUserOut, getFile, putFile
} from "blockstack";
import store from "@/storage/store";
import moment from "moment";

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
    // let myPublicKey = "02fe7675bc9340656964d9d99d4fa35444f81621433290ad32f3c7c06899f9c9fc";
    if (!auxiliaryProfile.bitcoinAddress) {
      // for backwards compat with items created before this object was added.
      throw new Error("Need the bitcoin address to do trading!");
    }
    var now = moment({}).valueOf();
    auxiliaryProfile.lastUpdate = now;
    if (!auxiliaryProfile.auxiliaryProfileId) {
      auxiliaryProfile.profileId = now;
    }
    // let myProfile = store.getters["myAccountStore/getMyProfile"];
    putFile(auxiliaryProfileRootFileName, JSON.stringify(auxiliaryProfile), {encrypt: true})
      .then(function() {
        success(auxiliaryProfile);
      })
      .catch(function() {
        failure({
          ERR_CODE: 4,
          message: "Error uploading profile: " + auxiliaryProfile.auxiliaryProfileId
        });
      });
  },
  getAuxiliaryProfile: function(success, failure) {
    let auxiliaryProfileRootFileName = store.state.constants.auxiliaryProfileRootFileName;
    let auxiliaryProfile = {};
    // let myProfile = store.getters["myAccountStore/getMyProfile"];
    getFile(auxiliaryProfileRootFileName, { decrypt: true })
      .then(function(file) {
        if (file) {
          auxiliaryProfile = JSON.parse(file);
        }
        success(auxiliaryProfile);
      })
      .catch(function() {
        failure({ ERR_CODE: 5, message: "no auxiliaryProfile found" });
      });
  }
};
export default myAccountService;
