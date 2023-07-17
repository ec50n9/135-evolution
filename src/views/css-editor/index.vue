<script setup>
import { ref, watch, inject } from "vue";
import EcWindow from "../../components/ec-window/index.vue";
import Editor from "./editor.vue";

const globalContext = inject("global-context");

// 格式化css文本
const formatCssText = (cssText) => {
  const cssTextArr = cssText.split(";").filter((item) => item);
  const result = cssTextArr.reduce((prev, item) => {
    const [key, value] = item.split(":");
    prev += `${key.trim()}: ${value.trim()};\n`;
    return prev;
  }, "");
  return result;
};

// 压缩css文本
const minimizeCssText = (cssText) => {
  const cssTextArr = cssText
    .trim()
    .split(";")
    .filter((item) => item);
  const result = cssTextArr.reduce((prev, item) => {
    const [key, value] = item.split(":");
    prev += `${key.trim()}:${value.trim()};`;
    return prev;
  }, "");
  return result;
};

const cssText = ref("");
watch(
  () => globalContext.data.mirrorEl,
  (el) => {
    const originCssText = el?.style.cssText ?? "";
    cssText.value = formatCssText(originCssText);
  }
);

const handleSave = (cssText) => {
  globalContext.history.modifyMirrorEl((el) => {
    el.style.cssText = cssText;
  });
  // (globalContext.data.mirrorEl ?? {}).style.cssText = minimizeCssText(cssText);
};
</script>

<template>
  <EcWindow title="样式编辑">
    <Editor
      :cssText="cssText"
      @update:cssText="(val) => (cssText = val)"
      @save="handleSave"
    />
  </EcWindow>
</template>

<style lang="scss" scoped></style>
