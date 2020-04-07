<template>
  <section class="infoPanel px-2">
    <div class="text-2xl font-serif border-b-2 border-inherit">
      COVID-19 Pandemic Data
    </div>
    <div class="">
      Data is based on the covid tracking project:
      <a class="underline" href="https://covidtracking.com" target="_blank"
        >covidtracking.com</a
      >
    </div>
    <div class="mt-4">Select a metric</div>
    <!-- dropdown -->
    <div class="relative mb-4">
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

    <div class="hidden md:block">
      <div class="text-2xl font-serif font-bold">
        {{ geoJsonDate }}
      </div>

      <div class="mt-4">
        High:
        <div
          class="text-2xl font-serif font-bold"
          :style="{
            color: getColor(highStateProperties.density)
          }"
        >
          {{ highStateProperties.name }} -
          {{ highStateProperties[$store.getters['states/property']] }}
        </div>
      </div>
      <div class="my-4">
        Low:
        <div
          class="text-2xl font-serif font-bold"
          :style="{
            color: getColor(lowStateProperties.density)
          }"
        >
          {{ lowStateProperties.name }} -
          {{ lowStateProperties[$store.getters['states/property']] }}
        </div>
      </div>

      <div class="mt-4 text-2xl font-serif font-bold">
        Historical
      </div>

      <input class="text-black" v-model="daysBack" type="number" />
      <button @click="playHistorical">playback</button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { getColor } from './densityColors'
interface PandemicOption {
  value: string
  label: string
}

@Component<InfoPanel>({})
export default class InfoPanel extends Vue {
  private getColor: Function = getColor
  private daysBack: number = 0

  private options: PandemicOption[] = [
    { value: 'death', label: 'Deaths' },
    { value: 'positive', label: 'Positive Test Results' },
    { value: 'negative', label: 'Negative Test Results' },
    { value: 'hospitalized', label: 'Hospitalized' },
    { value: 'totalTestResults', label: 'Total Test Results' }
  ]

  get geoJsonDate() {
    if (
      this.$store.getters['states/geoJson'].features[0] &&
      this.$store.getters['states/geoJson'].features[0].properties.date
    ) {
      const dateString = this.$store.getters[
        'states/geoJson'
      ].features[0].properties.date.toString()
      const date = new Date()
      date.setMonth(dateString.substring(4, 6))
      date.setDate(dateString.substring(6, 8))
      date.setFullYear(dateString.substring(0, 4))
      // OMG find a better waqy to convert this damn date
      date.setMonth(date.getMonth() - 1)
      //date.setDate(date.getDate() - 1)
      return date.toLocaleDateString()
    } else {
      return new Date().toLocaleDateString()
    }
  }

  get highStateProperties() {
    const highState = this.$store.getters['states/highestState']
    return highState && highState.properties ? highState.properties : {}
  }

  get lowStateProperties() {
    const lowState = this.$store.getters['states/lowestState']
    return lowState && lowState.properties ? lowState.properties : {}
  }

  get selectedStateProperties() {
    const selectedState = this.$store.getters['states/selectedState']
    return selectedState && selectedState.properties
      ? selectedState.properties
      : {}
  }

  private loadOption(property: any) {
    this.$store.dispatch('states/setDensityByProp', property.target.value)
  }

  private playHistorical() {
    this.$store.dispatch('states/playHistoricalData', {
      daysBack: this.daysBack
    })
  }

  mounted() {
    this.$store.dispatch('states/setDensityByProp', this.options[0].value)
  }
}
</script>
<style scoped>
.infoPanel {
  background: #0a0a0a;
  border-color: #262626;
}
</style>
