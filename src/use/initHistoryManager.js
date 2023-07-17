export default function (globalContext) {
  const context = globalContext.data;
  const history = {
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
  };
  globalContext.history = history;
}
