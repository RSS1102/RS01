import "react-app-polyfill/stable";
import "react-app-polyfill/ie11";

import React from "react";
import ReactDOM from "react-dom";
import WujieReact from "wujie-react";
import "antd/es/switch/style/css.js";
import "antd/es/tooltip/style/css.js";
import "antd/es/button/style/css.js";
import "./index.css";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import hostMap from "./hostMap";
import credentialsFetch from "./fetch";
import lifecycles from "./lifecycle";
import plugins from "./plugin";

const { setupApp, preloadApp, bus } = WujieReact;
const isProduction = process.env.NODE_ENV === "production";
bus.$on("click", (msg) => window.alert(msg));

const degrade =
  window.localStorage.getItem("degrade") === "true" ||
  !window.Proxy ||
  !window.CustomElementRegistry;
// 创建应用，主要是设置配置，preloadApp、startApp的配置基于这个配置做覆盖
setupApp({
  name: "vue3",
  url: hostMap("//localhost:8082/"),
  attrs: isProduction ? { src: hostMap("//localhost:8082/") } : {},
  exec: true,
  alive: true,
  plugins: [
    {
      cssExcludes: [
        "https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
      ],
    },
  ],
  // 引入了的第三方样式不需要添加credentials
  fetch: (url, options) =>
    url.includes(hostMap("//localhost:8082/"))
      ? credentialsFetch(url, options)
      : window.fetch(url, options),
  degrade,
  ...lifecycles,
});
if (window.localStorage.getItem("preload") !== "false") {
  if (window.Proxy) {
    preloadApp({
      name: "vue3",
    });
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
