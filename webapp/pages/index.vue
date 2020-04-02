<template>
  <div class="w-screen h-screen text-white">
    <div
      class="cursor-pointer title text-center text-5xl font-light"
      @click="showData = !showData"
    >
      Pandemic Map
    </div>
    <div v-if="showData">
      {{ $store.getters['states/states'] }}
    </div>
    <PandemicMap></PandemicMap>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PandemicMap from '~/components/PandemicMap.vue'

export default Vue.extend({
  components: {
    PandemicMap
  },
  data() {
    return {
      showData: false
    }
  }
})
</script>
<style>
body {
  background: #222222;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
