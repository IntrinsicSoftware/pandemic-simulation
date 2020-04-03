<template>
  <section class="bg-blue w-full h-full">
    <l-map :zoom="5" :center="[38.266219, -99.026642]" class="w-full h-full">
      <!-- Map layer -->
      <l-tile-layer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
      />
      <l-geo-json :geojson="geojson" :options="options" />
    </l-map>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { LMap, LGeoJson, LTileLayer } from 'vue2-leaflet'
import { GeoJson } from '../models/GeoJson'

@Component<PandemicMap>({
  components: {
    LGeoJson,
    LMap,
    LTileLayer
  }
})
export default class PandemicMap extends Vue {
  @Prop() private geojson!: GeoJson

  private options: any = {
    onEachFeature: this.onEachFeatureFunction
  }

  private onEachFeatureFunction(feature: any, layer: any) {
    layer.setStyle({
      color: this.getColor(feature.properties.density)
    })
    layer.on({
      click: () => {
        return this.entityClickHandler()
      },
      mouseover: () => {
        return this.entityMouseoverHandler(layer)
      },
      mouseout: () => {
        return this.entityMouseoutHandler(layer, feature)
      }
    })
  }

  private entityClickHandler() {
    // console.log('clicked layer', layer)
  }

  private entityMouseoverHandler(layer: any) {
    layer.setStyle({
      color: '#ffff00'
    })
  }

  private entityMouseoutHandler(layer: any, feature: any) {
    layer.setStyle({
      color: this.getColor(feature.properties.density)
    })
  }

  private getColor(d: number) {
    return d > 1000
      ? '#800026'
      : d > 500
      ? '#BD0026'
      : d > 200
      ? '#E31A1C'
      : d > 100
      ? '#FC4E2A'
      : d > 50
      ? '#FD8D3C'
      : d > 20
      ? '#FEB24C'
      : d > 10
      ? '#FED976'
      : '#FFEDA0'
  }
}
</script>
