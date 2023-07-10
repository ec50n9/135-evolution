import App from "./App.js";
import "./main.css";

console.log("--- inject start ---");

// 创建 #ec_window 元素
function injectEcWindow() {
  let ecWindow = document.createElement("div");
  ecWindow.id = "ec-window";
  document.body.appendChild(ecWindow);
}
injectEcWindow();

// 初始化vue
function initEcWindow() {
  Vue.createApp(App).mount("#ec-window");
}

window.onload = () => {
  console.log("页面加载完成");
  initEcWindow();
};

console.log("--- inject end ---");
