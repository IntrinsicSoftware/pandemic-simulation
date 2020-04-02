<template>
  <section class="bg-blue w-full h-full">
    <l-map :zoom="5" :center="[38.266219, -99.026642]" class="w-full h-full">
      <!-- Map layer -->
      <l-tile-layer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
    </l-map>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { LMap, LTileLayer } from 'vue2-leaflet'

@Component<PandemicMap>({
  components: {
    LMap,
    LTileLayer
  },
  mounted() {}
})
export default class PandemicMap extends Vue {}
</script>
