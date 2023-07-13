<template>
  <div class="ec-window">
    <Header
      ref="headerEl"
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
});

const headerEl = ref(null);
const activated = ref(false);
const x = ref(0);
const y = ref(0);

const handleDrag = ({ x: moveX, y: moveY }) => {
  x.value = moveX;
  y.value = moveY;
};

const handleMinimize = () => {
  console.log("minimize");
};

const handleClose = () => {
  console.log("close");
};
</script>

<style lang="scss" scoped>
.ec-window {
  position: fixed;
  left: v-bind("x + 'px'");
  top: v-bind("y + 'px'");
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
