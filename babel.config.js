module.exports = function (api) {
    api.cache(true);

    return {
        presets: [
            "module:metro-react-native-babel-preset",
            "babel-preset-expo",
        ],
        plugins: [
            "nativewind/babel",
            [
                "module:react-native-dotenv",
                {
                    moduleName: "@env",
                    path: ".env",
                    blacklist: null,
                    whitelist: null,
                    safe: false,
                    allowUndefined: false,
                },
            ],
            [
                "module-resolver",
                {
                    alias: {
                        "@": "./src",
                    },
                },
            ],
        ],
    };
};
