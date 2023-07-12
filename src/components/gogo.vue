<template>
  <div>
    <h1>gogo</h1>
    <p>{{ counter }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const counter = ref(0)
const increment = () => counter.value++
</script>

<style scoped>
h1 {
  color: red;
}
</style>