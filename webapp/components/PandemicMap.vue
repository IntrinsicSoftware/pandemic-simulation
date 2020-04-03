<template>
  <section class="bg-blue w-full h-full">
    <l-map
      ref="map"
      :zoom="5"
      :center="[38.266219, -99.026642]"
      class="w-full h-full"
    >
      <!-- Map layer -->
      <l-tile-layer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
      />
      <l-geo-json :geojson="geojson" :options="options" />
      <l-marker v-show="showTooltip" ref="marker" :lat-lng="markerLatLng">
        <l-tooltip
          >{{ hoveredFeature.properties.name }} -
          {{
            hoveredFeature.properties[$store.getters['states/property']]
          }}</l-tooltip
        >
      </l-marker>
    </l-map>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { LMap, LGeoJson, LMarker, LTooltip, LTileLayer } from 'vue2-leaflet'
import { GeoJson, Feature } from '../models/GeoJson'

@Component<PandemicMap>({
  components: {
    LGeoJson,
    LMap,
    LMarker,
    LTooltip,
    LTileLayer
  }
})
export default class PandemicMap extends Vue {
  @Prop() private geojson!: GeoJson

  private markerLatLng: number[] = [0, 0]
  private showTooltip: boolean = false
  private map: any = {}
  private marker: any = {}
  private hoveredFeature: any = {
    properties: {}
  }

  private options: any = {
    onEachFeature: this.onEachFeatureFunction
  }

  // private markerIcon = icon({
  //   iconUrl: '/img/su-27-blue.svg',
  //   iconSize: [20, 28],
  //   iconAnchor: [10, 14]
  // })

  mounted() {
    this.$nextTick(() => {
      this.map = (this.$refs.map && (this.$refs.map as any).mapObject) || null
      this.marker =
        (this.$refs.marker && (this.$refs.marker as any).mapObject) || null
    })
  }

  private onEachFeatureFunction(feature: Feature, layer: any) {
    layer.setStyle({
      color: this.getColor(feature.properties.density)
    })
    layer.on({
      click: () => {
        return this.entityClickHandler()
      },
      mouseover: () => {
        return this.entityMouseoverHandler(layer, feature)
      },
      mouseout: () => {
        return this.entityMouseoutHandler(layer, feature)
      },
      mousemove: (e: any) => {
        return this.entityMouseMoveHandler(e)
      }
    })
  }

  private entityClickHandler() {
    // console.log('clicked layer', layer)
  }

  private entityMouseMoveHandler(e: any) {
    this.markerLatLng = this.map.mouseEventToLatLng(e.originalEvent)
  }

  private entityMouseoverHandler(layer: any, feature: Feature) {
    this.hoveredFeature = feature
    this.showTooltip = true
    this.marker.openTooltip()
    layer.setStyle({
      color: '#ffff00'
    })
  }

  private entityMouseoutHandler(layer: any, feature: Feature) {
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
<style>
/* HACK TO GRAYSCALE THE DEFAULT MARKER */
.leaflet-marker-icon {
  filter: gray; /* IE6-9 */
  -webkit-filter: grayscale(1); /* Google Chrome, Safari 6+ & Opera 15+ */
  filter: grayscale(1); /* Microsoft Edge and Firefox 35+ */
}
</style>
