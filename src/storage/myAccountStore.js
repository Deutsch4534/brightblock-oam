import myAccountService from "@/services/myAccountService";

const myAccountStore = {
  namespaced: true,
  state: {
    myProfile: {
      username: null,
      loggedIn: false,
      showAdmin: false
    }
  },
  getters: {
    getMyProfile: state => {
      return state.myProfile;
    }
  },
  mutations: {
    myProfile(state, myProfile) {
      state.myProfile = myProfile;
    }
  },
  actions: {
    fetchMyAccount({ state, commit }) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        if (!myProfile.loggedIn) {
          if (myAccountService.isLoggedIn()) {
            myProfile = myAccountService.myProfile();
            commit("myProfile", myProfile);
          } else {
            myProfile = {
              loggedIn: false
            };
          }
        }
        myAccountService.getAuxiliaryProfile(function(auxiliaryProfile) {
          myProfile.auxiliaryProfile = auxiliaryProfile;
          commit("myProfile", myProfile);
          myAccountService.getPublicKeyData(myProfile, function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          }, function(err) {
            console.log(err);
            resolve(myProfile);
          });
        }, function(err) {
          console.log(err);
          resolve(myProfile);
        });
      });
    },
    updateAuxiliaryProfile({ state, commit }, auxiliaryProfile) {
      return new Promise(resolve => {
        myAccountService.updateAuxiliaryProfile(
          auxiliaryProfile,
          function(auxiliaryProfile) {
            let myProfile = state.myProfile;
            myProfile.auxiliaryProfile = auxiliaryProfile;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    updatePublicKeyData({ state, commit }, publicKeyData) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        myAccountService.updatePublicKeyData(publicKeyData,
          function(publicKeyData) {
            state.myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    addRelationship({ state, commit }, username) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        myAccountService.addRelationship(username,
          function(publicKeyData) {
            state.myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    }
  }
};
export default myAccountStore;
