<script setup>
import { onBeforeUnmount, onMounted, reactive } from "vue";
import { addStyle } from "./utils/inject-util.js";
import Preview from "./views/preview/index.vue";
import CssEditor from "./views/css-editor/index.vue";
import "./main.scss";

// 上下文
const context = reactive({
  editorEl: null,
  editingEl: null,
});

// 元素点击事件
const handleElementClick = (e) => {
  const target = e.target;
  if (target === context.editingEl) return;
  context.editingEl?.classList.remove("ective");
  context.editingEl = target;
  context.editingEl?.classList.add("ective");
};

onMounted(() => {
  context.editorEl = document.querySelector("#ueditor_0");

  // 注入选中样式到编辑器
  addStyle(
    `.ective {
        outline: 1.5px dashed #f43f5e !important;
        outline-offset: 2px !important;
        position: relative !important;
      }`,
    context.editorEl?.contentDocument.head
  );

  // 监听点击事件
  context.editorEl?.contentDocument.body.addEventListener(
    "click",
    handleElementClick
  );
});

onBeforeUnmount(() => {
  // 移除选中样式
  context.editorEl?.contentDocument.head.lastElementChild.remove();

  // 移除点击事件
  context.editorEl?.contentDocument.body.removeEventListener(
    "click",
    handleElementClick
  );
});
</script>

<template>
  <div>
    <Preview :context="context" />
    <CssEditor :context="context" />
  </div>
</template>
