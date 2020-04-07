<template>
  <section class="w-screen h-screen text-white flex flex-col md:flex-row">
    <info-panel
      class="relative w-full md:w-1/2 lg:w-1/3 xl:w-1/4 md:h-screen"
    ></info-panel>
    <pandemic-map
      class="relative w-full h-full z-0"
      :geojson="$store.getters['states/selectedGeoJson']"
    ></pandemic-map>
    <footer-component
      class="fixed bottom-0 left-0 right-0 z-10"
    ></footer-component>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PandemicMap from '~/components/PandemicMap.vue'
import FooterComponent from '~/components/Footer.vue'
import InfoPanel from '~/components/InfoPanel.vue'

@Component<HomePage>({
  components: {
    InfoPanel,
    FooterComponent,
    PandemicMap
  }
})
export default class HomePage extends Vue {}
</script>
<style>
body {
  background: #222222;
}
.title {
  font-family: Futura, 'Trebuchet MS', Arial, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-variant: normal;
  font-weight: 700;
  line-height: 26.4px;
}
</style>
