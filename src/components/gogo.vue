<template>
  <EcWindow>
    <div>
      <h1>gogo</h1>
      <p>{{ counter }}</p>
      <button @click="increment">Increment</button>
    </div>
  </EcWindow>
</template>

<script setup>
import { ref } from "vue";
import EcWindow from "./ec-window/index.vue";

const counter = ref(0);
const increment = () => counter.value++;
</script>

<style lang="scss" scoped>
h1 {
  color: red;
}
</style>
