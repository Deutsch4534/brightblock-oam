const dev = location.origin.indexOf("localhost") > -1;
export const CONSTANTS = {
  apiKey: "46171452",
  nodeEnv: (dev) ? "development" : "production",
  blockchain: "Ethereum",
  environment: (dev) ? "development" : "production",
  shapeShiftUrl: "https://cors.shapeshift.io",
  ethGatewayUrl: (dev) ? "http://localhost:8191" : "https://api.transit8.com",
  btcGatewayUrl: (dev) ? "https://api.brightblock.org" : "https://api.brightblock.org",
  searchUrl: (dev) ? "http://localhost:8193" : "https://search.brightblock.org",
  networkExpected: (dev) ? "Ganache" : "Ropsten (3)",
  gaiaHubUrl: "https://gaia.brightblock.org",

  debugMode: false,
  domain: location.origin,
  artworkRootFileName: "records_v01.json",
  auctionsRootFileName: "auctions_v01.json",
  gaiaFileName: "record_"
};
