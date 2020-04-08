<template>
  <section class="border-b-2 px-4 text-white">
    <div class="flex items-center h-16">
      <input
        v-model="dateIndex"
        type="range"
        min="0"
        :max="dateRange.length - 1"
        class="appearance-none w-full h-1 bg-gray-400 rounded outline-none slider-thumb"
        @input="slideChangeHandler"
      />
      <div class="mx-4 cursor-pointer text-gray-500">
        <svg
          v-if="!playing"
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current h-8 w-8"
          viewBox="0 0 20 20"
          @click="playTimeline"
        >
          <path d="M4 4l12 6-12 6z" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current h-8 w-8"
          viewBox="0 0 20 20"
          @click="stopTimeline"
        >
          <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
        </svg>
      </div>
      <div class="cursor-pointer relative  text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          class="fill-current h-5 w-5"
          @click="showOptions = !showOptions"
        >
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </div>
    </div>

    <!-- OPTIONS -->
    <div
      v-if="showOptions"
      class="options absolute right-0 bg-black p-4 rounded rounded-t-none mt-0 border-t-2 z-20"
    >
      <div class="mb-4">
        <div class="text-xl">Metric</div>
        <div class="relative">
          <select
            v-model="metric"
            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            @change="setMetric"
          >
            <option
              v-for="(option, index) in metrics"
              :key="index"
              :name="option"
              :value="option"
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
      <div class="relative mt-4">
        <div class="text-xl">Timeline Speed</div>
        <input
          v-model="intervalSpeed"
          type="range"
          min="50"
          max="2500"
          class="appearance-none w-full h-1 bg-gray-400 rounded outline-none slider-thumb"
          :style="{ direction: 'rtl' }"
          @change="restartTimeline"
        />
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 mx-4 z-10">
      <div
        class="absolute left-0 text-2xl mt-2 md:mt-0 md:text-4xl lg:text-5xl xl:text-6xl font-serif"
      >
        {{ selectedMetric.label }}
      </div>
      <div
        class="absolute right-0 text-2xl mt-2 md:mt-0 md:text-4xl lg:text-5xl xl:text-6xl font-serif"
      >
        {{ date }}
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
const DateUtil = require('../utils/DateUtility')

interface PandemicMetric {
  value: string
  label: string
}

const metrics: PandemicMetric[] = [
  { value: 'death', label: 'COVID-19 Deaths' },
  { value: 'positive', label: 'COVID-19 Positive' },
  { value: 'negative', label: 'COVID-19 Negative' },
  { value: 'hospitalized', label: 'Hospitalized' },
  { value: 'totalTestResults', label: 'COVID-19 Total Tests' }
]

@Component<Header>({})
export default class Header extends Vue {
  private dateIndex: number = 0
  private playing: boolean = false
  private showOptions: boolean = false
  private interval: any = null
  private intervalSpeed: number = 250
  private metrics: PandemicMetric[] = metrics
  private metric: PandemicMetric = metrics[0]

  get dateRange() {
    return this.$store.getters['states/dateRange'] || []
  }

  get selectedMetric() {
    if (!this.$store.getters['states/selectedMetric']) {
      return
    }
    const pandemicMetric = this.metrics.find((item: PandemicMetric) => {
      return item.value === this.$store.getters['states/selectedMetric']
    })

    if (pandemicMetric) {
      return pandemicMetric
    }
  }

  get date() {
    return this.$store.getters['states/date']
      ? this.$store.getters['states/date'].toLocaleDateString()
      : null
  }

  mounted() {
    this.dateIndex = this.dateRange.length - 1
    // Fire an even to set the intial datas density
    // kinda of a hack, the store shoudl initialize with correct density
    const date = this.dateRange[this.dateRange.length - 1]
    if (date) {
      this.$store.dispatch('states/setGeoJsonByDate', date)
    }
  }

  private setMetric() {
    const metric = this.metric.value
    if (metric) {
      this.$store.dispatch('states/setMetric', metric)
    }
  }

  private slideChangeHandler() {
    const date = this.dateRange[this.dateIndex]
    if (date) {
      this.$store.dispatch('states/setGeoJsonByDate', date)
    }
    this.stopTimeline()
  }

  private stopTimeline() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.playing = false
  }

  private playTimeline() {
    let date = this.dateRange[this.dateIndex]
    // If we are currently on the latest date, start timeline from beginning
    if (this.dateIndex === this.dateRange.length - 1) {
      date = this.dateRange[0]
    }
    this.stopTimeline()
    if (!date) {
      return
    }
    let index = this.dateRange.findIndex((item: any) => {
      return (
        DateUtil.getApiStringFromDate(item) ===
        DateUtil.getApiStringFromDate(date)
      )
    })
    try {
      this.playing = true
      this.interval = setInterval(() => {
        this.$store.dispatch('states/setGeoJsonByDate', this.dateRange[index])
        index++
        if (index === this.dateRange.length) {
          this.stopTimeline()
        } else {
          this.dateIndex = index
        }
      }, this.intervalSpeed)
    } catch (err) {
      this.stopTimeline()
    }
  }

  private restartTimeline() {
    if (this.playing) {
      this.stopTimeline()
      this.playTimeline()
    }
  }
}
</script>
<style scoped lang="sass">
section, .options
  background: rgb(10,10,10)
  border-color: #262626

.options
  background: rgba(10,10,10, 0.9)
.slider-thumb::-webkit-slider-thumb
  @apply appearance-none w-6 h-6 rounded-full bg-gray-500 cursor-pointer

.slider-thumb::-webkit-slider-thumb:hover
  @apply bg-gray-700
</style>
