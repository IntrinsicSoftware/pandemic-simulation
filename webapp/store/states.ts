import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { PandemicMetric, pandemicMetrics } from '~/models/PandemicMetric'
import { IStateApiData } from '~/models/IStateApiData'
import { GeoJson, Feature } from '~/models/GeoJson'
import stateData from '~/static/data/statesData.json'
const apiGeoJsonAdapter = require('../utils/stateGeoJsonAdapter')
const DateUtil = require('../utils/DateUtility')
const allApiData: IStateApiData = stateData
const defaultMetric: PandemicMetric = pandemicMetrics[0]

/* Date range of data */
const dateRange = Object.keys(stateData)
  .map((dateString) => {
    return DateUtil.getDateFromApiString(dateString)
  })
  .sort((a, b) => {
    if (a.getTime() < b.getTime()) {
      return -1
    }
    if (a.getTime() > b.getTime()) {
      return 1
    }
    return 0
  })

/*  Used to seed the initial store data */
const latestDate = dateRange[dateRange.length - 1]

/*
  Helper to set the density value for every feature in the geoJson payload.
  The density is calculated against the highest value found in the data.
  The density range is 0 - 1000 and the density palettes determine the colors
*/
const getFeaturesWithDensity = (metric: PandemicMetric, geoJson: GeoJson) => {
  const highestPropertyValue = geoJson.features.reduce((acc, feature) => {
    const value = Number(feature.properties[metric.value])
    if (value > acc) {
      acc = value
    }
    return acc
  }, 0)
  // Get the ratio for calculating density between 0 - 1000
  const ratio = 1000 / highestPropertyValue
  // Update density based on ratio for each state
  const features = geoJson.features.reduce((acc, feature) => {
    const propertyValue = Number(feature.properties[metric.value])
    const newFeature = { ...feature } as Feature
    let density = 0
    if (propertyValue) {
      density = ratio * propertyValue
    }
    newFeature.properties = { ...feature.properties }
    newFeature.properties.density = density
    acc.push(newFeature)
    return acc
  }, [] as Feature[])
  return features
}

function getInitialGeoJson(): GeoJson {
  const apiDateString = DateUtil.getApiStringFromDate(latestDate)
  const stateGeoJson = apiGeoJsonAdapter(allApiData[apiDateString])
  const features = getFeaturesWithDensity(defaultMetric, stateGeoJson)
  stateGeoJson.features = features
  return stateGeoJson
}

@Module
class StatesModule extends VuexModule {
  selectedGeoJson: GeoJson = getInitialGeoJson()
  selectedMetric: PandemicMetric = defaultMetric
  selectedState: string | null = null
  dateRange: Date[] = dateRange
  date: Date = latestDate

  @Mutation
  SET_FEATURES(features: Feature[]) {
    this.selectedGeoJson.features = features
  }

  @Mutation
  SET_METRIC(selectedMetric: PandemicMetric) {
    this.selectedMetric = selectedMetric
  }

  @Mutation
  SET_SELECTED_STATE_NAME(selectedState: string) {
    this.selectedState = selectedState
  }

  @Mutation
  SET_DATE(date: Date) {
    this.date = date
  }

  @Action
  setGeoJson(geoJson: GeoJson) {
    const features = getFeaturesWithDensity(this.selectedMetric, geoJson)
    this.context.commit('SET_FEATURES', features)
  }

  @Action
  setMetric(metric: PandemicMetric) {
    this.context.commit('SET_METRIC', metric)
    this.context.dispatch('setGeoJson', this.selectedGeoJson)
  }

  @Action
  setGeoJsonByDate(date: Date) {
    const apiDateString = DateUtil.getApiStringFromDate(date)
    const apiData = apiGeoJsonAdapter(allApiData[apiDateString])
    this.context.commit('SET_DATE', date)
    this.context.dispatch('setGeoJson', apiData)
  }

  @Action({ commit: 'SET_SELECTED_STATE_NAME' })
  setSelectedStateName(feature: Feature) {
    return feature.properties.name
  }

  get getDate() {
    return this.date
  }

  get getDateRange() {
    return this.dateRange
  }

  get getSelectedGeoJson() {
    return this.selectedGeoJson
  }

  get getSelectedMetric() {
    return this.selectedMetric
  }

  get getSelectedState() {
    if (!this.selectedGeoJson) {
      return
    }
    const item = this.selectedGeoJson.features.find((item: Feature) => {
      return item.properties.name === this.selectedState
    })
    return item
  }
}

export default StatesModule
