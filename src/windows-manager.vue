<script setup>
import useInit from "./use/useInit";
import Preview from "./views/preview/index.vue";
import CssEditor from "./views/css-editor/index.vue";
import History from "./views/history/index.vue";
import Note from "./views/note/index.vue";
import "./main.scss";

useInit();
</script>

<template>
  <Preview />
  <CssEditor />
  <History />
  <Note />
</template>
