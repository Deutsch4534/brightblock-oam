const dev = location.origin.indexOf("localhost") > -1;
export const CONSTANTS = {
  apiKey: "46171452",
  nodeEnv: (dev) ? "development" : "production",
  environment: (dev) ? "development" : "production",
  shapeShiftUrl: "https://cors.shapeshift.io",
  ethGatewayUrl: (dev) ? "http://localhost:8191" : "https://api.brightblock.org",
  btcGatewayUrl: (dev) ? "http://localhost:8191" : "https://api.brightblock.org",
  searchUrl: (dev) ? "http://localhost:8193" : "https://search.brightblock.org",
  invoiceRates: {
    platformAddress: (dev) ? "2Mxyetr5jqQdE6WDtS9x9re43F9JTCxdeJK" : "2N3rYRQu4h29JreiM8kF6KGKVoLkgVj2pTc",
    platformFee: 4.2,
    artistResidualFee: 3.0,
    galleryResidualFee: 1.5,
  },
  networkExpected: (dev) ? "Ganache" : "Ropsten (3)",
  gaiaHubUrl: "https://gaia.brightblock.org",

  featureEthereum: false,
  featureBitcoin: true,
  featureAuctions: true,
  debugMode: false,
  domain: location.origin,
  invoicesRootFileName: "invoices_v01.json",
  auxiliaryProfileRootFileName: "profiles_v01.json",
  artworkRootFileName: "records_v01.json",
  auctionsRootFileName: "auctions_v01.json",
  gaiaFileName: "record_"
};
