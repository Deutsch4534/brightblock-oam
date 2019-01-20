export const CONSTANTS = {
  environment: process.env.NODE_ENV,
  apiKey: process.env.TOK_BOX_API_KEY,
  shapeShiftUrl: process.env.SHAPE_SHIFT_URL,
  crowdAddress: process.env.CROWD_ADDRESS,
  ethGatewayUrl: process.env.ETH_GATEWAY_URL,
  btcGatewayUrl: process.env.BTC_GATEWAY_URL,
  searchUrl: process.env.SEARCH_INDEX_URL,
  gaiaHubUrl: process.env.GAIA_HUB_URL,
  debugMode: process.env.DEBUG_MODE,
  networkExpected: process.env.ETHEREUM_NETWORK,
  domain: location.origin,
  artworkRootFileName: "records_v01.json",
  auctionsRootFileName: "auctions_v01.json",
  gaiaFileName: "record_"
};
