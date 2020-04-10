<template>
  <section class="text-white">
    <l-map ref="map" :center="[38, -99]" class="w-full h-full">
      <!-- Map layer -->
      <l-tile-layer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
      />
      <l-geo-json :geojson="geojson" :options="options" />
      <l-marker ref="active-marker" :lat-lng="activeMarkerLatLng">
        <l-tooltip
          ><span class="text-base font-bold">
            {{ selectedState.properties.name }}
          </span>
          <span class="text-base ">
            {{ selectedState.properties[selectedMetric.value] | numeric }}
          </span></l-tooltip
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
  },
  filters: {
    numeric(num: number) {
      if (num) {
        return num.toLocaleString()
      }
      return 0
    }
  }
})
export default class PandemicMap extends Vue {
  @Prop() private geojson!: GeoJson

  private map: any = {}
  private activeMarkerLatLng: number[] = [0, 0]
  private activeMarker: any = {}
  private mouseOverHighlightColor: string = '#ffff00'
  private options: any = {
    onEachFeature: this.onEachFeatureFunction
  }

  get colorPalette() {
    return this.$store.getters['states/getSelectedMetric'].palette
  }

  get selectedState() {
    if (!this.$store.getters['states/getSelectedState']) {
      return {
        properties: { name: '' }
      }
    }
    return this.$store.getters['states/getSelectedState']
  }

  get selectedMetric() {
    return this.$store.getters['states/getSelectedMetric']
  }

  mounted() {
    this.$nextTick(() => {
      this.map = (this.$refs.map && (this.$refs.map as any).mapObject) || null
      this.activeMarker =
        (this.$refs['active-marker'] &&
          (this.$refs['active-marker'] as any).mapObject) ||
        null
      this.map.fitBounds([
        [23, -131],
        [52, -61]
      ])
    })
  }

  private onEachFeatureFunction(feature: Feature, layer: any) {
    layer.setStyle({
      color: this.colorPalette.getColor(feature.properties.density)
    })
    layer.on({
      click: () => {
        return this.entityClickHandler(layer, feature)
      },
      mouseover: () => {
        return this.entityMouseoverHandler(layer)
      },
      mouseout: () => {
        return this.entityMouseoutHandler(layer, feature)
      }
    })
  }

  private entityClickHandler(layer: any, feature: Feature) {
    this.activeMarkerLatLng = layer.getBounds().getCenter()
    this.activeMarker.openTooltip()
    this.$store.dispatch('states/setSelectedStateName', feature)
  }

  private entityMouseoverHandler(layer: any) {
    this.activeMarker.openTooltip()
    layer.setStyle({
      color: this.mouseOverHighlightColor
    })
  }

  private entityMouseoutHandler(layer: any, feature: Feature) {
    layer.setStyle({
      color: this.colorPalette.getColor(feature.properties.density)
    })
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
