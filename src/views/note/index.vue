<script setup>
import { inject, ref } from "vue";
import EcWindow from "../../components/ec-window/index.vue";
import NoteEditor from "./note-editor.vue";

const globalContext = inject("global-context");

const content = ref("");
</script>

<template>
  <NoteEditor v-model="content" />
</template>
