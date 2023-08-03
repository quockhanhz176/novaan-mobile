// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

const crypto = require("crypto");
const fs = require("fs");

let hash = crypto.createHash("sha256");
hash.update(fs.readFileSync(".env"));
const cacheVersion = hash.digest("hex");

module.exports = { ...getDefaultConfig(__dirname), cacheVersion };
