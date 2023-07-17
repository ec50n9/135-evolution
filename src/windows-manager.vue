<script setup>
import useInit from "./use/useInit";
import Preview from "./views/preview/index.vue";
import CssEditor from "./views/css-editor/index.vue";
import History from "./views/history/index.vue";
import Note from "./views/note/index.vue";
import AdFreeService from "./services/ad-free";
import initHistoryManager from "./use/initHistoryManager.js";
import initEcWindowsManager from "./use/initEcWindowsManager.js";
import "./main.scss";

const globalContext = useInit();

initHistoryManager(globalContext);
initEcWindowsManager(globalContext, [
  {
    id: "preview",
    component: Preview,
  },
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
]);

const services = [AdFreeService];
services.forEach((service) => service(globalContext));
</script>

<template>
  <component
    v-for="window in globalContext.windowsManager.list"
    :key="window.id"
    :is="window.component"
  />
</template>
