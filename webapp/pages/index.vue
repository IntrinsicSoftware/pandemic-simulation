<template>
  <section class="w-screen h-screen flex flex-col">
    <header-component
      class="fixed top-0 left-0 right-0 z-10"
    ></header-component>
    <pandemic-map
      class="relative w-full h-full z-0"
      :geojson="$store.getters['states/getSelectedGeoJson']"
    ></pandemic-map>
    <footer-component></footer-component>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PandemicMap from '~/components/PandemicMap.vue'
import FooterComponent from '~/components/Footer.vue'
import HeaderComponent from '~/components/Header.vue'

@Component<HomePage>({
  components: {
    HeaderComponent,
    FooterComponent,
    PandemicMap
  }
})
export default class HomePage extends Vue {}
</script>
<style>
.leaflet-control-zoom {
  display: none;
}
body {
  background: #222222;
}
</style>
