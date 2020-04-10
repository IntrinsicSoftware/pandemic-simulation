<template>
  <section class="border-b-2 px-4 text-white">
    <div class="flex items-center h-16">
      <div
        class="mr-4 cursor-pointer text-gray-500"
        :class="{ 'text-blue-500': showInfo }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fill-current h-6 w-6"
          viewBox="0 0 20 20"
          @click="showInfo = !showInfo"
        >
          <path
            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
          />
        </svg>
      </div>
      <input
        v-model="timelineDateIndex"
        type="range"
        step="1"
        min="0"
        :max="dateRange.length - 1"
        class="appearance-none w-full h-1 bg-gray-400 rounded outline-none slider-thumb"
        @input="timelineChangeHandler"
        @change="timelineChangeHandler"
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
      <div
        class="cursor-pointer relative text-gray-500"
        :class="{ 'text-blue-500': showOptions }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="fill-current h-8 w-8"
          @click="showOptions = !showOptions"
        >
          <path
            d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
          />
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
          step="1"
          min="50"
          max="2500"
          class="appearance-none w-full h-1 bg-gray-400 rounded outline-none slider-thumb"
          :style="{ direction: 'rtl' }"
          @input="restartTimeline"
          @change="restartTimeline"
        />
      </div>
    </div>

    <!-- Info -->
    <div
      v-if="showInfo"
      class="info absolute left-0 bg-black p-4 rounded rounded-t-none mt-0 border-t-2 z-20"
    >
      <div class="mb-4">
        <div class="text-3xl font-serif">COVID-19 Data</div>
        <p class="my-2">
          Built by
          <a
            href="//www.intrinsic.ventures"
            class="underline text-blue-700"
            target="_blank"
            >Intrinsic Ventures</a
          >
        </p>
        <p class="my-2">
          Data is pulled daily from the
          <a
            href="https://covidtracking.com/"
            class="underline text-blue-700"
            target="_blank"
            >COVID Tracking Project</a
          >. <br />Latest date pulled: {{ lastUpdated }} (ET)
        </p>
        <p>
          Map is powered by
          <a
            href="https://leafletjs.com/"
            class="underline text-blue-700"
            target="_blank"
            >Leaflet</a
          >. Map tiles by Carto, under CC BY 3.0. <br />
          Data by OpenStreetMap, under ODbL.
        </p>
      </div>
    </div>

    <!-- Date and metric labels -->
    <div class="absolute bottom-0 left-0 right-0 mx-4 z-10">
      <div
        class="absolute left-0 text-2xl mt-2 md:mt-0 md:text-4xl lg:text-5xl xl:text-6xl font-serif"
      >
        {{ selectedMetric.label }}
      </div>
      <div
        class="absolute right-0 text-2xl mt-2 md:mt-0 md:text-4xl lg:text-5xl xl:text-6xl"
      >
        {{ date }}
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { PandemicMetric, pandemicMetrics } from '../models/PandemicMetric'
const DateUtil = require('../utils/DateUtility')

@Component<Header>({})
export default class Header extends Vue {
  private playing: boolean = false
  private showOptions: boolean = false
  private showInfo: boolean = false
  private interval: any = null
  private intervalSpeed: number = 250
  private metrics: PandemicMetric[] = pandemicMetrics
  private metric: PandemicMetric = pandemicMetrics[0]

  get timelineDateIndex() {
    return this.dateRange.findIndex((date: Date) => {
      return this.$store.getters['states/getDate'] === date
    })
  }

  get lastUpdated() {
    return this.$store.getters['states/getLastUpdated']
      ? this.$store.getters['states/getLastUpdated'].toLocaleString()
      : null
  }

  set timelineDateIndex(index: number) {
    // index
  }

  get dateRange() {
    return this.$store.getters['states/getDateRange'] || []
  }

  get selectedMetric() {
    return this.$store.getters['states/getSelectedMetric'] || {}
  }

  get date() {
    return this.$store.getters['states/getDate']
      ? this.$store.getters['states/getDate'].toLocaleDateString()
      : null
  }

  private setMetric() {
    this.$store.dispatch('states/setMetric', this.metric)
  }

  private timelineChangeHandler(e: any) {
    const date = this.dateRange[e.target.value]
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
    let date = this.dateRange[this.timelineDateIndex]
    // If we are currently on the latest date, start timeline from beginning
    if (Number(this.timelineDateIndex) === this.dateRange.length - 1) {
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
          this.timelineDateIndex = index
        }
      }, this.intervalSpeed)
    } catch (err) {
      this.stopTimeline()
    }
  }

  private restartTimeline() {
    if (this.playing) {
      this.playTimeline()
    }
  }
}
</script>
<style scoped lang="sass">
section, .options, .info
  background: rgb(10,10,10)
  border-color: #262626

.slider-thumb::-webkit-slider-thumb
  @apply appearance-none w-6 h-6 rounded-full bg-gray-500 cursor-pointer

.slider-thumb::-webkit-slider-thumb:hover
  @apply bg-blue-700
</style>
