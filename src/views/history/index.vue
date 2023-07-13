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
    <div style="display: flex; column-gap: .5rem;">
      <button @click="handleUndo">撤销</button>
      <button @click="handleRedo">重做</button>
      <button @click="handleApply">应用</button>
    </div>
  </EcWindow>
</template>