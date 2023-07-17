<template>
  <div class="ec-window">
    <Header
      :title="props.title"
      @drag="handleDrag"
      @minimize="handleMinimize"
      @close="handleClose"
    />
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Header from "./header.vue";

const props = defineProps({
  title: {
    type: String,
    default: "EC Window",
  },
  rect: {
    type: Object,
    default: () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }),
  },
});

const emit = defineEmits(["drag", "minimize", "close"]);

/**
 * @param {object} data
 * @param {number} data.x
 * @param {number} data.y
 */
const handleDrag = (data) => emit("drag", data);

const handleMinimize = () => emit("minimize");

const handleClose = () => emit("close");
</script>

<style lang="scss" scoped>
.ec-window {
  position: fixed;
  left: v-bind("props.rect.x + 'px'");
  top: v-bind("props.rect.y + 'px'");
  display: flex;
  flex-direction: column;
  width: 22rem;
  max-height: 90%;
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  border-radius: 1rem;
}

.content {
  flex: 1;
  overflow: hidden auto;
  padding: 0.5rem;
}
</style>
