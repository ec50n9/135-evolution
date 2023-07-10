import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import BannerWebpackPlugin from "./plugins/banner-webpack-plugin/index.js";

import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production",
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.user.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new BannerWebpackPlugin({
      banner: `
// ==UserScript==
// @name        微信编辑器增强🧬(dev)
// @namespace   http://tampermonkey.net/
// @match       *://www.135editor.com/*
// @match       *://bj.96weixin.com/*
// @match       *://www.365editor.com/*
// @match       *://mp.weixin.qq.com/*
// @icon        https://www.135editor.com/img/vip/vip.png
// @require     https://cdn.jsdelivr.net/npm/jscolor-picker@2.0.4/jscolor.min.js
// @require     https://unpkg.com/vue@3.3.4/dist/vue.global.js
// @grant       GM_addStyle
// @version     2.0.2-dev
// @author      ec50n9
// @description 为135、96、365编辑器去除广告，免vip，增加css样式编辑面板等...
// @license     MIT
// ==/UserScript==
      `,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: path.resolve("./loaders/css-loader"),
            options: {
              insert: "head",
              // 'style' or 'text' or 'gm'
              type: "gm",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        exclude: /index\.html/,
        use: [
          {
            loader: path.resolve("./loaders/html-loader"),
            options: {
              // 'element' or 'text'
              type: "text",
            },
          },
        ],
      },
    ],
  },
};
