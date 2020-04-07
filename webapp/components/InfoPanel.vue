<template>
  <section class="infoPanel px-2">
    <div class="text-2xl md:text-3xl font-bold text-center">
      COVID-19 Data
    </div>

    <div
      class="text-2xl text-center md:text-3xl font-bold border-b-2 pb-2 border-inherit"
    >
      {{ date }}
    </div>

    <div class="text-xs mt-1">
      Data is based on the COVID Tracking Project
      <a class="underline" href="//covidtracking.com" target="_blank"
        >covidtracking.com</a
      >
    </div>

    <div class="mt-4 text-2xl font-bold">
      Metric
    </div>
    <div class="relative mb-4">
      <select
        class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        @change="setMetric"
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

    <div v-if="!$store.getters['states/playing']">
      <div class="mt-4 text-2xl font-bold">
        Date
      </div>
      <div class="relative mb-4">
        <select
          v-model="selectedDate"
          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          @change="setDate"
        >
          <option
            v-for="(option, index) in dateRange"
            :key="index"
            :name="option"
            :value="option"
            >{{ option.toLocaleDateString() }}</option
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

      <button
        v-if="selectedDate !== '' && !$store.getters['states/playing']"
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
        @click="playHistorical"
      >
        Play Timeline
      </button>
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

  private selectedDate: any = ''

  private options: PandemicOption[] = [
    { value: 'death', label: 'COVID-19 Deaths' },
    { value: 'positive', label: 'COVID-19 Positive' },
    { value: 'negative', label: 'COVID-19 Negative' },
    { value: 'hospitalized', label: 'Hospitalized' },
    { value: 'totalTestResults', label: 'COVID-19 Total Tests' }
  ]

  get date() {
    return this.$store.getters['states/date']
      ? this.$store.getters['states/date'].toLocaleDateString()
      : ''
  }

  get dateRange() {
    return this.$store.getters['states/dateRange']
  }

  get selectedStateProperties() {
    const selectedState = this.$store.getters['states/selectedState']
    return selectedState && selectedState.properties
      ? selectedState.properties
      : {}
  }

  private setMetric(metric: any) {
    this.$store.dispatch('states/setMetric', metric.target.value)
  }

  private playHistorical() {
    this.selectedDate = ''
    this.$store.dispatch('states/playHistoricalData')
  }

  private setDate() {
    this.$store.dispatch('states/setGeoJsonByDate', this.selectedDate)
  }

  mounted() {
    this.$store.dispatch('states/setMetric', this.options[0].value)
  }
}
</script>
<style scoped>
.infoPanel {
  background: #0a0a0a;
  border-color: #262626;
}
</style>
