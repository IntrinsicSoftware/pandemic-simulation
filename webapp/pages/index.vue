<template>
  <div class="container mx-auto w-screen h-screen">
    <div @click="showData = !showData" class="cursor-pointer title text-center text-5xl font-light">
      Pandemic Map
    </div>
    <div v-if="showData">
      {{  $store.getters['states/states'] }}
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
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #35495e;
}
</style>
