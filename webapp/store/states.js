import stateData from '~/static/data/statesData.json'
const apiGeoJsonAdapter = require('../utils/stateGeoJsonAdapter')
const DateUtil = require('../utils/DateUtility')

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

const latestStateData =
  stateData[Object.keys(stateData)[Object.keys(stateData).length - 1]]

const state = () => ({
  selectedGeoJson: apiGeoJsonAdapter(latestStateData),
  selectedMetric: 'death',
  selectedState: null,
  dateRange,
  playing: false,
  date: DateUtil.getDateFromApiString(latestStateData[0].date)
})

let interval = null

const actions = {
  playHistoricalData({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      const DELAY = 500
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      commit('SET_PLAYING', true)
      let index = dateRange.findIndex((item) => {
        return (
          DateUtil.getApiStringFromDate(item) ===
          DateUtil.getApiStringFromDate(state.date)
        )
      })
      try {
        interval = setInterval(() => {
          dispatch('setGeoJsonByDate', dateRange[index])
          index++
          if (index === dateRange.length) {
            clearInterval(interval)
            interval = null
            commit('SET_PLAYING', false)
            resolve()
          }
        }, DELAY)
      } catch (err) {
        reject(err)
      }
    })
  },
  setGeoJson({ commit, state }, geoJson) {
    const selectedMetric = state.selectedMetric.toString()
    const highestPropertyValue = geoJson.features.reduce((acc, feature) => {
      const value = Number(feature.properties[selectedMetric])
      if (value > acc) {
        acc = value
      }
      return acc
    }, 0)
    // Get the ratio for calculating density between 0 - 1000
    const ratio = 1000 / highestPropertyValue
    // Update density based on ratio for each state
    const features = geoJson.features.reduce((acc, feature) => {
      const propertyValue = Number(feature.properties[selectedMetric])
      const newFeature = { ...feature }
      let density = 0
      if (propertyValue) {
        density = ratio * propertyValue
      }
      newFeature.properties = { ...feature.properties }
      newFeature.properties.density = density
      acc.push(newFeature)
      return acc
    }, [])
    commit('SET_FEATURES', features)
  },
  setMetric({ commit, dispatch, state }, metric) {
    commit('SET_METRIC', metric)
    dispatch('setGeoJson', state.selectedGeoJson)
  },
  setGeoJsonByDate({ commit, dispatch }, date) {
    const apiDateString = DateUtil.getApiStringFromDate(date)
    const apiData = apiGeoJsonAdapter(stateData[apiDateString])
    commit('SET_DATE', date)
    dispatch('setGeoJson', apiData)
  },
  setSelectedStateName({ commit }, state) {
    commit('SET_SELECTED_STATE', state.properties.name)
  }
}

const getters = {
  date: (state) => {
    return state.date
  },
  dateRange: (state) => {
    return state.dateRange
  },
  selectedGeoJson: (state) => {
    return state.selectedGeoJson
  },
  selectedMetric: (state) => {
    return state.selectedMetric
  },
  selectedState: (state) => {
    if (!state.selectedGeoJson) {
      return
    }
    const item = state.selectedGeoJson.features.find((item) => {
      return item.properties.name === state.selectedState
    })
    return item
  },
  playing: (state) => {
    return state.playing
  }
}

const mutations = {
  SET_FEATURES(state, features) {
    state.selectedGeoJson.features = features
  },
  SET_FEATURE(state, { index, newFeature }) {
    state.selectedGeoJson.features.splice(index, 1, newFeature)
  },
  SET_METRIC(state, selectedMetric) {
    state.selectedMetric = selectedMetric
  },
  SET_SELECTED_STATE(state, selectedState) {
    state.selectedState = selectedState
  },
  SET_DATE(state, date) {
    state.date = date
  },
  SET_PLAYING(state, playing) {
    state.playing = playing
  }
}

export { actions, getters, mutations, state }
