<script setup>
import { inject } from "vue";
import EcWindow from "../../components/ec-window/index.vue";

const globalContext = inject("global-context");

const handleUndo = () => {
  globalContext.undo();
};
const handleRedo = () => {
  globalContext.redo();
};
const handleApply = () => {
  globalContext.syncMirrorEl();
};
</script>

<template>
  <EcWindow title="历史操作">
    <div style="display: flex; flex-direction: column; gap: 0.5rem">
      <div
        v-for="(item, index) in globalContext.data.snapshot"
        :key="index"
        class="snapshot-item"
        :class="{
          'snapshot-item--active':
            globalContext.data.currentSnapshotIndex === index,
        }"
      >
        <div v-html="item.outerHTML" />
      </div>
    </div>
    <div style="display: flex; column-gap: 0.5rem">
      <button @click="handleUndo">撤销</button>
      <button @click="handleRedo">重做</button>
      <button @click="handleApply">应用</button>
    </div>
  </EcWindow>
</template>

<style lang="scss" scoped>
.snapshot-item {
  border: 0.2rem solid transparent;
  cursor: pointer;

  &--active {
    border-color: #409eff;
  }
}
</style>
