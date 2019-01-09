export const CONSTANTS = {
  environment: process.env.NODE_ENV,
  apiKey: process.env.VUE_APP_TOK_BOX_API_KEY,
  shapeShiftUrl: process.env.VUE_APP_SHAPE_SHIFT_URL,
  crowdAddress: process.env.VUE_APP_CROWD_ADDRESS,
  ethGatewayUrl: process.env.VUE_APP_ETH_GATEWAY_URL,
  btcGatewayUrl: process.env.VUE_APP_BTC_GATEWAY_URL,
  searchUrl: process.env.VUE_APP_SEARCH_INDEX_URL,
  gaiaHubUrl: process.env.VUE_APP_GAIA_HUB_URL,
  debugMode: process.env.VUE_APP_DEBUG_MODE,
  networkExpected: process.env.VUE_APP_ETHEREUM_NETWORK,
  domain: location.origin,
  artworkRootFileName: "records_v01.json",
  auctionsRootFileName: "auctions_v01.json",
  gaiaFileName: "record_"
};
