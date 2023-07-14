<script setup>
import useInit from "./use/useInit";
import Preview from "./views/preview/index.vue";
import CssEditor from "./views/css-editor/index.vue";
import History from "./views/history/index.vue";
import Note from "./views/note/index.vue";
import "./main.scss";

useInit();

const windows = [
  {
    id: "preview",
    component: Preview,
  },
  {
    id: "css-editor",
    component: CssEditor,
  },
  {
    id: "history",
    component: History,
  },
  {
    id: "note",
    component: Note,
  },
];
</script>

<template>
  <component
    v-for="window in windows"
    :key="window.id"
    :is="window.component"
  />
</template>
