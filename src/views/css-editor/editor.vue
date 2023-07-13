<script setup>
const props = defineProps({
  cssText: String,
});

const emit = defineEmits(["update:cssText", "save"]);

const handleKeydown = (e) => {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    e.stopPropagation();

    emit("save", props.cssText);
  }
};

const bindEvent = () => window.addEventListener("keydown", handleKeydown);
const unbindEvent = () => window.removeEventListener("keydown", handleKeydown);
</script>

<template>
  <div class="editor">
    <textarea
      class="textarea"
      :value="props.cssText"
      @input="emit('update:cssText', $event.target.value)"
      @focus="bindEvent"
      @blur="unbindEvent"
      cols="auto"
      rows="10"
    />
  </div>
</template>

<style lang="scss" scoped>
.editor {
  .textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: 1rem;
    font-family: "Consolas", monospace;
  }
}
</style>
