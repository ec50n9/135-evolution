<template>
  <div class="control-center">
    <div
      v-for="item in controlList"
      :key="item.id"
      class="item"
      :class="{ 'item--enable': item.enable }"
      @click="handleToggle(item)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script setup>
import { reactive, inject, markRaw } from "vue";
import Preview from "../preview/index.vue";
import CssEditor from "../css-editor/index.vue";
import History from "../history/index.vue";
import Note from "../note/index.vue";

const globalContext = inject("global-context");

const controlList = reactive([
  {
    id: "preview",
    title: "预览",
    component: markRaw(Preview),
    enable: false,
  },
  {
    id: "css-editor",
    title: "样式编辑",
    component: markRaw(CssEditor),
    enable: false,
  },
  {
    id: "history",
    title: "历史操作",
    component: markRaw(History),
    enable: false,
  },
  {
    id: "note",
    title: "笔记",
    component: markRaw(Note),
    enable: false,
  },
]);

const handleToggle = (item) => {
  globalContext.windowsManager.createWindow({
    id: item.id,
    title: item.title,
    component: item.component,
  });
  item.enable = !item.enable;
};
</script>

<style lang="scss" scoped>
.control-center {
  width: 100%;
  background-color: #fff;
}

.item {
  color: #999;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  &--enable {
    color: #409eff;
  }
}
</style>
