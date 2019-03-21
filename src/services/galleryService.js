import { getFile, putFile } from "blockstack";
import moment from "moment";
import searchIndexService from "@/services/searchIndexService";
import { CONSTANTS } from "@/storage/constants";

const galleryService = {
  updateMyGalleries: function(rootFile) {
    const galleriesRootFileName = CONSTANTS.galleriesRootFileName;
    return putFile(galleriesRootFileName, JSON.stringify(rootFile), {
      encrypt: false
    });
  },

  initGalleryData: function() {
    return new Promise((resolve, reject) => {
      const galleriesRootFileName = CONSTANTS.galleriesRootFileName;
      getFile(galleriesRootFileName, { decrypt: false }).then(function(file) {
        if (!file) {
          var now = moment({}).valueOf();
          let newRootFile = {
            created: now,
            records: []
          };
          putFile(galleriesRootFileName, JSON.stringify(newRootFile), {encrypt: false}).then(function(file) {
            resolve(newRootFile);
          });
        } else {
          let rootFile = JSON.parse(file);
          resolve(rootFile);
        }
      });
    });
  },

  fetchGalleriesFromGaia: function(username) {
    return new Promise((resolve, reject) => {
      const galleriesRootFileName = CONSTANTS.galleriesRootFileName;
      let options = {decrypt: false};
      if (username) {
        options.username = username;
      }
      getFile(galleriesRootFileName, options)
        .then(function(file) {
          if (file) {
            let rootFile = JSON.parse(file);
            resolve(rootFile.records);
          }
        })
        .catch(function() {
          resolve({});
        });
    });
  },

  uploadGallery: function(myGalleries, gallery) {
    return new Promise((resolve, reject) => {
      if (!gallery.galleryId) {
        throw new Error("Expected a gallery id to be set.");
      }
      myGalleries.records.splice(0, 0, gallery);
      galleryService.updateMyGalleries(myGalleries).then(function() {
        searchIndexService.addRecord("gallery", gallery).then(() => {
          if (gallery.privacy === "public") {
            searchIndexService.addRecord("gallery", gallery);
          }
          resolve(gallery);
        });
      });
    });
  }
};
export default galleryService;
