<template>
  <div class="container mx-auto w-screen h-screen">
    <div class="title text-center text-5xl font-light">
      Pandemic Map
    </div>
    <PandemicMap></PandemicMap>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PandemicMap from '~/components/PandemicMap.vue'
import 'leaflet/dist/leaflet.css'

export default Vue.extend({
  components: {
    PandemicMap
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
