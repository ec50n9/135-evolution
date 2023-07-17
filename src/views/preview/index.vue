<script setup>
import { inject, watch } from "vue";
import HtmlPreview from "./html-preview.vue";

const globalContext = inject("global-context");
</script>

<template>
  <HtmlPreview :htmlText="globalContext.data.mirrorEl?.outerHTML" />
</template>
