<script setup>
import { ref, watch } from "vue";
import EcWindow from "../../components/ec-window/index.vue";
import Editor from "./editor.vue";

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

const props = defineProps({
  context: {
    type: Object,
    required: true,
  },
});

const cssText = ref("");
watch(
  () => props.context.editingEl,
  (el) => {
    const originCssText = el?.style.cssText ?? "";
    cssText.value = formatCssText(originCssText);
  }
);

const handleSave = (cssText) => {
  (props.context.editingEl ?? {}).style.cssText = minimizeCssText(cssText);
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
