const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ensure Metro recognizes JSON files
config.resolver.assetExts.push("json");

// Force Metro to watch node_modules/react-native-gentoo-sdk/assets
config.watchFolders = [
  __dirname + "/node_modules/react-native-gentoo-sdk/dist/assets"
];

module.exports = config;
