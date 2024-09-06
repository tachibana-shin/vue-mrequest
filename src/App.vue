<template>
  <div>
    <div v-if="loading">loading...</div>
    <div v-if="error">failed to fetch</div>
    <div v-if="data">Hey! {{ data }}</div>

    <button @click="page++">page++ {{ page }}</button>
    <button @click="runAsync">Run</button>
  </div>
</template>

<script lang="ts" setup>
import { useRequest } from "../lib"
import { ref } from "vue"

const page = ref(1)
const { data, loading, error, runAsync } = useRequest(() =>
  fetch("/" + `?page=${page.value}`).then((res) => res.text())
)
</script>
