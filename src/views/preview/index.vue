<script setup>
import EcWindow from "../../components/ec-window/index.vue";
import HtmlPreview from "./html-preview.vue";

const props = defineProps({
  context: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <EcWindow title="预览窗口">
    <HtmlPreview :htmlText="props.context.editingEl?.outerHTML" />
  </EcWindow>
</template>
