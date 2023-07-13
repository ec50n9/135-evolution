<script setup>
import { onBeforeUnmount, onMounted, provide, reactive, triggerRef } from "vue";
import { addStyle } from "./utils/inject-util.js";
import Preview from "./views/preview/index.vue";
import CssEditor from "./views/css-editor/index.vue";
import History from "./views/history/index.vue";
import "./main.scss";

// 上下文
const context = reactive({
  editorEl: null,
  editingEl: null,
  mirrorEl: null,

  snapshot: [],
  currentSnapshotIndex: 0,
  snapshotMaxLength: 10,
});

const globalContext = {
  data: context,

  /**
   * 修改编辑器元素
   * @param {(el: any) => void} handler
   */
  modifyMirrorEl: (handler) => {
    if (!context.mirrorEl) return;

    if (context.snapshot.length >= context.snapshotMaxLength)
      context.snapshot.shift();

    context.snapshot.push(context.mirrorEl.cloneNode(true));
    handler(context.mirrorEl);
    // 触发更新
    context.mirrorEl = context.mirrorEl.cloneNode(true);
  },

  /**
   * 同步更改到编辑器元素
   */
  syncMirrorEl: () => {
    if (!context.snapshot.length || !context.editingEl) return;
    context.editingEl.outerHTML = context.mirrorEl.outerHTML;
  },

  /**
   * 撤销
   */
  undo: (step = 1) => {
    if (!context.snapshot.length || !context.editingEl) return;
    context.currentSnapshotIndex = Math.max(
      0,
      context.currentSnapshotIndex - step
    );
    context.mirrorEl =
      context.snapshot[context.currentSnapshotIndex].cloneNode(true);
  },

  /**
   * 重做
   */
  redo: (step = 1) => {
    if (!context.snapshot.length || !context.editingEl) return;
    context.currentSnapshotIndex = Math.min(
      context.snapshot.length - 1,
      context.currentSnapshotIndex + step
    );
    context.mirrorEl =
      context.snapshot[context.currentSnapshotIndex].cloneNode(true);
  },
};
provide("global-context", globalContext);

// 元素点击事件
const handleElementClick = (e) => {
  const target = e.target;
  if (target === context.editingEl) return;
  context.editingEl?.classList.remove("ective");
  context.editingEl = target;
  context.mirrorEl = target.cloneNode(true);
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
    <Preview />
    <CssEditor />
    <History />
  </div>
</template>
