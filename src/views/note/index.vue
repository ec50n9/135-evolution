<script setup>
import { inject, ref} from "vue";
import EcWindow from "../../components/ec-window/index.vue";
import NoteEditor from "./note-editor.vue";

const globalContext = inject("global-context");

const content = ref("")
</script>

<template>
  <EcWindow title="小笔记">
    <NoteEditor v-model="content" />
  </EcWindow>
</template>
