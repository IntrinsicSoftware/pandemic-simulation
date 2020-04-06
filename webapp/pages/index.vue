<template>
  <div class="w-screen h-screen text-white">
    <div class="dropdown flex justify-center z-10 m-2 w-1/5">
      <div class="relative w-full">
        <select
          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          @change="loadOption"
        >
          <option
            v-for="(option, index) in options"
            :key="index"
            :name="option.label"
            :value="option.value"
            >{{ option.label }}</option
          >
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
        >
          <svg
            class="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
          </svg>
        </div>
      </div>
    </div>
    <pandemic-map
      class="relative z-0"
      :geojson="$store.getters['states/geoJson']"
    ></pandemic-map>
    <footer-component class="fixed w-screen bottom-0"></footer-component>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PandemicMap from '~/components/PandemicMap.vue'
import FooterComponent from '~/components/Footer.vue'

interface PandemicOption {
  value: string
  label: string
}

@Component<HomePage>({
  components: {
    FooterComponent,
    PandemicMap
  }
})
export default class HomePage extends Vue {
  private options: PandemicOption[] = [
    { value: 'death', label: 'Deaths' },
    { value: 'positive', label: 'Positive Test Results' },
    { value: 'negative', label: 'Negative Test Results' },
    { value: 'hospitalized', label: 'Hospitalized' },
    { value: 'totalTestResults', label: 'Total Test Results' }
  ]

  private loadOption(property: any) {
    this.$store.dispatch('states/setDensityByProp', property.target.value)
  }

  mounted() {
    this.$store.dispatch('states/setDensityByProp', this.options[0].value)
  }
}
</script>
<style>
body {
  background: #222222;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.dropdown {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
</style>
