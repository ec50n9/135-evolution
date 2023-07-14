<template>
  <textarea cols="30" rows="10" :value="props.value"></textarea>
</template>

<script setup>
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:value"]);
</script>

<style lang="scss" scoped></style>
