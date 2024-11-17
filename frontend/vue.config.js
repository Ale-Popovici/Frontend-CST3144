// vue.config.js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:
    process.env.NODE_ENV === "production" ? "/Frontend-CST3144/" : "/",
  configureWebpack: {
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  },
});
