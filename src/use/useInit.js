import { onBeforeUnmount, onMounted, provide, reactive, triggerRef } from "vue";
import { addStyle, getEnv } from "../utils/inject-util.js";

// 上下文
const context = reactive({
  env: getEnv(),
  editorEl: null,
  editingEl: null,
  mirrorEl: null,

  snapshot: [],
  currentSnapshotIndex: 0,
  snapshotMaxLength: 10,
});

// 全局上下文
const globalContext = {
  data: context,
};

// 编辑器元素事件
const handleElementClick = (e) => {
  const target = e.target;
  if (target === context.editingEl) return;
  context.editingEl?.classList.remove("ective");
  context.editingEl = target;
  context.mirrorEl = target.cloneNode(true);
  context.snapshot = [context.mirrorEl.cloneNode(true)];
  context.editingEl?.classList.add("ective");
};

export default function () {
  provide("global-context", globalContext);

  // 挂载完成，初始化元素，绑定监听
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

  // 卸载前，移除选中样式，移除监听
  onBeforeUnmount(() => {
    // 移除选中样式
    context.editorEl?.contentDocument.head.lastElementChild.remove();

    // 移除点击事件
    context.editorEl?.contentDocument.body.removeEventListener(
      "click",
      handleElementClick
    );
  });

  return globalContext;
}
