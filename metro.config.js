const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// JSON 파일을 번들러가 처리하도록 추가
config.resolver.assetExts.push("json");

// 라이브러리 내 assets 폴더를 명시적으로 번들러에 포함 (SDK 내 이미지, JSON을 인식 가능하게)
config.resolver.extraNodeModules = {
  "react-native-gentoo-sdk": __dirname + "/node_modules/react-native-gentoo-sdk"
};

module.exports = config;