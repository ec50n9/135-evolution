import Preview from "./views/preview.js";
import CssEditor from "./views/css-editor.js";
import { addStyle } from "./utils/inject-util.js";
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
    data() {
      return {
        context: {
          editorEl: null,
          editingEl: null,
        },
      };
    },
    mounted() {
      // 获取编辑器
      this.context.editorEl = document.querySelector("#ueditor_0");

      // 注入激活后的样式
      addStyle(
        `.ective {
            outline: 1.5px dashed #f43f5e !important;
            outline-offset: 2px !important;
            position: relative !important;
          }`,
        this.context.editorEl.contentDocument.head
      );

      // 监听editorEl点击
      this.context.editorEl.contentDocument
        .querySelector("body")
        .addEventListener("click", (e) => {
          this.context.editingEl?.classList.remove("ective");
          this.context.editingEl = e.target;
          this.context.editingEl.classList.add("ective");
        });
    },
    beforeUnmount() {
      // 移除样式
      this.context.editorEl.contentDocument.head.lastElementChild.remove();

      // 移除监听
      this.context.editorEl.contentDocument
        .querySelector("body")
        .removeEventListener("click", this.handleEditorClick);
    },
    render() {
      return h("div", [
        h(Preview, { context: this.context }),
        h(CssEditor, { context: this.context }),
      ]);
    },
  }).mount("#ec-window");

  console.log("--- initEcWindow end ---");
}

window.onload = () => {
  initEcWindow();
};
