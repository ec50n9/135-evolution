import { onBeforeUnmount, onMounted, provide, reactive, triggerRef } from "vue";
import { addStyle } from "../utils/inject-util.js";

// 上下文
const context = reactive({
  editorEl: null,
  editingEl: null,
  mirrorEl: null,

  snapshot: [],
  currentSnapshotIndex: 0,
  snapshotMaxLength: 10,
});

// 历史管理
const useHistoryManager = (context) => ({
  /**
   * 修改编辑器元素
   * @param {(el: any) => void} handler
   */
  modifyMirrorEl: (handler) => {
    if (!context.mirrorEl) return;

    if (context.currentSnapshotIndex === context.snapshotMaxLength - 1) {
      // 删除第一个快照，保持快照数量不变
      context.snapshot.shift();
      context.currentSnapshotIndex--;
    } else {
      // 删除当前快照之后的快照
      context.snapshot.splice(context.currentSnapshotIndex + 1);
    }

    handler(context.mirrorEl);

    context.snapshot.push(context.mirrorEl.cloneNode(true));
    context.currentSnapshotIndex++;

    // 触发更新
    context.mirrorEl = context.mirrorEl.cloneNode(true);
  },

  /**
   * 同步更改到编辑器元素
   */
  syncMirrorEl: () => {
    if (!context.snapshot.length || !context.editingEl) return;
    const node = context.mirrorEl.cloneNode(true);
    node.classList.add("ective");
    context.editingEl.insertAdjacentElement("afterend", node);
    context.editingEl.remove();
    context.editingEl = node;
    context.snapshot = [context.editingEl.cloneNode(true)];
    context.currentSnapshotIndex = 0;
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
});

// 全局上下文
const globalContext = {
  data: context,
  ...useHistoryManager(context),
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
}
