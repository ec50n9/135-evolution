<script setup>
import { inject, watch } from "vue";
import EcWindow from "../../components/ec-window/index.vue";
import HtmlPreview from "./html-preview.vue";

const globalContext = inject("global-context");
</script>

<template>
  <EcWindow title="预览窗口">
    <HtmlPreview :htmlText="globalContext.data.mirrorEl?.outerHTML" />
  </EcWindow>
</template>
