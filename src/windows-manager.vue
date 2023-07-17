<script setup>
import useInit from "./use/useInit";
import ControlCenter from "./views/control-center/index.vue";
import AdFreeService from "./services/ad-free";
import initHistoryManager from "./use/initHistoryManager.js";
import initEcWindowsManager from "./use/initEcWindowsManager.js";
import "./main.scss";

const globalContext = useInit();

initHistoryManager(globalContext);
initEcWindowsManager(globalContext, [
  {
    title: "控制面板",
    component: ControlCenter,
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
