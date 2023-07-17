<template>
  <div ref="headerEl" class="header">
    <div class="title">{{ title }}</div>
    <div class="action-btns">
      <div
        v-for="item in btns"
        class="action-btn"
        :style="{ backgroundColor: item.color }"
        @click="item.onClick"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["minimize", "close", "drag"]);

const headerEl = ref(null);
onMounted(() => {
  headerEl.value.addEventListener("mousedown", (e) => {
    const { clientX, clientY } = e;
    const { left, top } = headerEl.value.getBoundingClientRect();
    const disX = clientX - left;
    const disY = clientY - top;
    const move = (e) => {
      const { clientX, clientY } = e;
      const x = clientX - disX;
      const y = clientY - disY;
      emit("drag", { x, y });
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
});

const btns = [
  {
    color: "#10b981",
    onClick: () => emit("minimize"),
  },
  {
    color: "#eab308",
    onClick: () => emit("close"),
  },
];
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  padding: 0 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  user-select: none;
  cursor: move;
}
.action-btns {
  display: flex;
  gap: 0.5rem;
}
.action-btn {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  cursor: pointer;
}
</style>
