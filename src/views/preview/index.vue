<script setup>
import { inject } from "vue";
import HtmlPreview from "./html-preview.vue";

const globalContext = inject("global-context");
</script>

<template>
  <HtmlPreview :htmlText="globalContext.data.mirrorEl?.outerHTML" />
</template>
