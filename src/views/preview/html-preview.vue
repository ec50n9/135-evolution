<script setup>
import { computed, onMounted, reactive, watch, ref } from "vue";

const props = defineProps({
  htmlText: String,
});

const previewDragEl = ref(null);
const threeD = reactive({
  enable: false,
  dragging: false,
  x: 0,
  y: 0,
});

/**
 * 生成3d效果
 * @param {string} html
 */
const makeIt3d = (html) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const target = wrapper.firstChild;

  // 分层
  function makeLevel(el, level = 0) {
    el.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 4px 12px";
    el.style.transformStyle = "preserve-3d";
    el.style.transform += `translateZ(${level * 0.2}rem)`;
    if (el.children.length) {
      Array.from(el.children).forEach((child) => makeLevel(child, level + 1));
    }
  }
  makeLevel(target);

  return wrapper.innerHTML;
};

const htmlPreview = computed(() =>
  props.htmlText && threeD.enable ? makeIt3d(props.htmlText) : props.htmlText
);

watch(
  () => threeD.enable,
  () => {
    if (threeD.enable) {
      threeD.x = 45;
      threeD.y = 45;
    } else {
      threeD.x = 0;
      threeD.y = 0;
    }
  }
);

onMounted(() => {
  // previewEl拖拽更新视图角度
  const maxAngle = 60;
  let startX = 0;
  let startY = 0;
  previewDragEl.value.addEventListener("mousedown", (e) => {
    if (!threeD.enable) return;
    e.preventDefault();

    const listenerEl = document.body;

    threeD.dragging = true;
    startX = e.pageX;
    startY = e.pageY;

    const onMouseMove = (e) => {
      if (!threeD.dragging) return;
      const x = e.pageX - startX;
      const y = e.pageY - startY;
      (threeD.x > maxAngle && x > 0) ||
        (threeD.x < -maxAngle && x < 0) ||
        (threeD.x += x);
      (threeD.y > maxAngle && y < 0) ||
        (threeD.y < -maxAngle && y > 0) ||
        (threeD.y -= y);

      startX = e.pageX;
      startY = e.pageY;
    };
    const onMouseUp = () => {
      threeD.dragging = false;
      listenerEl.removeEventListener("mousemove", onMouseMove);
      listenerEl.removeEventListener("mouseup", onMouseUp);
    };

    listenerEl.addEventListener("mousemove", onMouseMove);
    listenerEl.addEventListener("mouseup", onMouseUp);
  });
});
</script>

<template>
  <div class="html-preview">
    <div class="action-bar">
      <label for="3d">3d预览</label>
      <input type="checkbox" name="3d" v-model="threeD.enable" />
    </div>
    <div ref="previewDragEl">
      <div
        class="preview-wrapper"
        v-html="htmlPreview ?? '请点击编辑器中的元素'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.html-preview {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;

  .action-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: 0.5rem;
  }

  .preview-wrapper {
    perspective: 60rem;
    transform: rotateY(v-bind('threeD.x+"deg"'))
      rotateX(v-bind('threeD.y+"deg"'));
    transform-style: preserve-3d;
    transition: v-bind('threeD.dragging ? "none" : "all 0.3s"');
    user-select: none;
    cursor: grab;
  }
}
</style>
