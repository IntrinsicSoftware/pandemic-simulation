<template>
  <section class="bg-blue w-full h-full">
    <l-map :zoom="5" :center="[38.266219, -99.026642]" class="w-full h-full">
      <!-- Map layer -->
      <l-tile-layer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      <l-geo-json :geojson="geojson" :options="options" />
    </l-map>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { LMap, LGeoJson, LTileLayer } from 'vue2-leaflet'
import { icon } from 'leaflet'
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

  // private options: any = {
  //   onEachFeature() {
  //     console.log('on each featuer')
  //   }
  // }

  private onEachFeatureFunction(feature: any, layer: any) {
    console.log('feature: ', feature)
    console.log('layer: ', layer)
    // ICON

    // const testIcon = icon({
    //   iconUrl: '/img/su-27-blue.svg',
    //   iconSize: [20, 33],
    //   iconAnchor: [10, 16]
    // })

    // layer.setIcon(testIcon)

    layer.setStyle({
      color: this.getColor(feature.properties.density)
    })

    // Marker click handler
    layer.on({
      click: () => {
        return this.entityClickHandler(layer)
      }
    })
  }

  private entityClickHandler(layer: any) {
    console.log('clicked iotem', layer)
  }

  private getColor(d) {
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
