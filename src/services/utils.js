import SHA256 from "crypto-js/sha256";
import _ from "lodash";
import store from "@/storage/store";
import moment from "moment";
import bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import bs58check from "bs58check";
import moneyUtils from "@/services/moneyUtils";

const utils = {
  dt_Offset(serverTime, compareTime) {
    let message = "Starts in: ";
    if (serverTime > compareTime) {
      message = "Finished: ";
    }
    let now = moment(serverTime);
    let starts = moment(compareTime);
    let days = starts.diff(now, "days");
    if (days !== 0) {
      message += Math.abs(days) + " days ";
    }
    starts = starts.subtract(days, "day");
    let hours = starts.diff(now, "hours");
    if (hours !== 0) {
      message += Math.abs(hours) + " hours ";
    }
    starts = starts.subtract(hours, "hour");
    let mins = starts.diff(now, "minutes");
    if (mins !== 0) {
      message += Math.abs(mins) + " mins ";
    }
    starts = starts.subtract(mins, "minute");
    let seconds = starts.diff(now, "seconds");
    if (seconds !== 0) {
      message += Math.abs(seconds) + " secs ";
    }
    if (serverTime > compareTime) {
      message += " ago.";
    }
    return message;
  },

  buildWebrtcSessionData(connection, data) {
    let pairs = data.split(",");
    let username = pairs[0].split("=")[1];
    let auctionId = pairs[1].split("=")[1];
    return { connection: connection, username: username, auctionId: auctionId };
  },

  buildArtworkHash(artworkUrl) {
    if (artworkUrl && artworkUrl.length > 0) {
      return "0x" + SHA256(artworkUrl).toString();
    }
  },

  buildBitcoinHash(artwork) {
    let hashBase = artwork.artist + ":" + artwork.image;
    return SHA256(hashBase).toString();
  },

  buildGaiaUrl(gaiaUrl, artworkId) {
    let gaiaFileName = store.state.constants.gaiaFileName;
    // let url = null
    // building gaiaUrl from userProfile data is possibly more efficient but it seems to give the wrong value..
    // if (userProfileGaiaUrl) {
    //  url = userProfile.gaiaUrl + indexData.id + '.json'
    // }
    let urlLastSlash = gaiaUrl.lastIndexOf("/");
    let url = gaiaUrl.substring(0, urlLastSlash);
    if (!url.endsWith("/")) {
      url = url + "/";
    }
    return url + gaiaFileName + artworkId + ".json";
  },

  convertFromBlockstack: function(record) {
    if (!record.indexData.uploader || !record.indexData.id) {
      throw new Error({
        ERR_CODE: 200,
        error: "Uploader and id must be present."
      });
    }
    if (!record.provData) {
      record.provData = {};
    }
    if (!record.provData.artwork) {
      record.provData.artwork = [];
    }
    if (!record.provData.images) {
      record.provData.images = [];
    }
    if (!record.provData.supportingDocuments) {
      record.provData.supportingDocuments = [];
    }
    let artworkData = this.getArtworkData(record.provData);
    return _.merge(artworkData, {
      id: record.indexData.id,
      title: record.indexData.title,
      description: record.indexData.description,
      lastUpdate: record.indexData.lastUpdate,
      keywords: record.indexData.keywords,
      itemType: record.indexData.itemType,
      uploader: record.indexData.uploader,
      artist: record.indexData.artist
        ? record.indexData.artist
        : record.indexData.uploader,
      owner: record.indexData.owner
        ? record.indexData.owner
        : record.indexData.uploader,
      saleData: record.indexData.saleData,
      medium: record.indexData.medium,
      dimensions: record.indexData.dimensions,
      yearCreated: record.indexData.yearCreated,
      editions: record.indexData.editions ? record.indexData.editions : 1,
      edition: record.indexData.edition ? record.indexData.edition : 1,
      gaiaUrl: record.provData.gaiaUrl,
      bcitem: record.provData.bcitem
    });
  },

  convertToBlockstack: function(artwork) {
    if (!artwork.uploader || !artwork.id) {
      throw new Error({
        ERR_CODE: 200,
        error: "Uploader and id must be present."
      });
    }
    let indexData = {
      id: artwork.id,
      title: artwork.title,
      description: artwork.description,
      itemType: artwork.itemType,
      lastUpdate: artwork.lastUpdate,
      keywords: artwork.keywords,
      owner: artwork.owner,
      uploader: artwork.uploader,
      artist: artwork.artist,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      yearCreated: artwork.yearCreated,
      editions: artwork.editions ? artwork.editions : 1,
      edition: artwork.edition ? artwork.edition : 1
    };

    if (artwork.saleData) {
      indexData.saleData = artwork.saleData;
    } else {
      indexData.saleData = moneyUtils.buildInitialSaleData();
    }

    let provData = {
      id: artwork.id,
      images: artwork.images,
      artwork: artwork.artwork,
      coa: artwork.coa,
      created: artwork.created,
      supportingDocuments: artwork.supportingDocuments,
      bcitem: artwork.bcitem
    };
    if (artwork.artwork && artwork.artwork.length > 0) {
      provData.derivedTimestamp = utils.buildArtworkHash(
        artwork.artwork[0].dataUrl
      );
    }
    return {
      indexData: indexData,
      provData: provData
    };
  },

  getArtworkData: function(provData) {
    let artworkData = {
      artwork: provData.artwork,
      coa: provData.coa,
      images: provData.images,
      supportingDocuments: provData.supportingDocuments,
      created: provData.created,
      bcitem: provData.bcitem
    };
    if (
      provData.artwork &&
      provData.artwork[0] &&
      provData.artwork[0].dataUrl.length > 0
    ) {
      artworkData.image = provData.artwork[0].dataUrl;
      artworkData.timestamp = utils.buildArtworkHash(
        provData.artwork[0].dataUrl
      );
    } else {
      provData.artwork = [];
      artworkData.image = "/images/missing-image.jpg";
    }
    return artworkData;
  },

  signBitcoin: function(privkey, message) {
    var keyPair = bitcoin.ECPair.fromWIF(privkey);
    // console.log(keyPair)
    var privateKey = keyPair.privateKey;
    var signature = bitcoinMessage.sign(
      message,
      privateKey,
      keyPair.compressed
    );
    return signature.toString("base64");
  },

  /**
   * Sign the given hex-encoded bytes.
   */
  verifySignature: function(publicKey, signature, message) {
    // TODO: verifying the signature doesn't work but needs to at some point..
    publicKey = bs58check.encode(publicKey); // tried also keypair.publicKey from above
    console.log(bitcoinMessage.verify(message, publicKey, signature));
  }
};

export default utils;
