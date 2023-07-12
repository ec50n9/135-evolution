import Preview from "./views/preview.js";
import "./main.css";

// 创建 #ec_window 元素
function injectEcWindow() {
  console.log("--- injectEcWindow start ---");

  let ecWindow = document.createElement("div");
  ecWindow.id = "ec-window";
  document.body.appendChild(ecWindow);
  
  console.log("--- injectEcWindow end ---");
}
injectEcWindow();

// 初始化vue
function initEcWindow() {
  console.log("--- initEcWindow start ---");

  const { createApp, h } = Vue;
  createApp({
    render() {
      return h(Preview);
    },
  }).mount("#ec-window");

  console.log("--- initEcWindow end ---");
}

window.onload = () => {
  initEcWindow();
};
