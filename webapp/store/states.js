import geoJson from '~/static/data/stateGeoJson.json'
const axios = require('axios')
const apiGeoJsonAdapter = require('../config/stateGeoJsonAdapter')
const API_URL = 'https://covidtracking.com/api/states/daily'

const state = () => ({
  geoJson,
  property: null,
  selectedState: null,
  highestState: null,
  lowestState: null
})

let interval = null

const actions = {
  async playHistoricalData(
    { commit, dispatch, state },
    { daysBack, delay = 50 }
  ) {
    if (interval) {
      clearInterval(interval)
      interval = null
    }

    // TODO - load all the data up front in memory, then loop over, rather than making a request in a loop
    // FIND a better way do deal with dates, my goodness

    const promises = []

    while (daysBack > -1) {
      const date = new Date()
      date.setTime(date.getTime() - daysBack * 24 * 60 * 60 * 1000)
      let month = date.getUTCMonth() + 1
      let day = date.getUTCDate() - 1
      if (month.toString().length < 2) {
        month = '0' + month
      }
      if (day.toString().length < 2) {
        day = '0' + day
      }
      promises.push(
        axios.get(API_URL + '?date=' + date.getUTCFullYear() + month + day)
      )
      daysBack--
    }

    const results = await Promise.all(promises)

    let index = 0

    interval = setInterval(() => {
      if (results[index] && !results[index].data.error) {
        console.log('results[index]', results[index])
        const result = apiGeoJsonAdapter(results[index].data)
        commit('SET_FEATURES', result.features)
        dispatch('setDensityByProp', state.property) // why does this throw an error when we comment this out?
      }
      if (index >= results.length - 1) {
        clearInterval(interval)
        interval = null
      }
      index++
    }, delay)
  },
  setDensityByProp({ commit, state }, property) {
    const highestPropertyValue = state.geoJson.features.reduce(
      (acc, feature) => {
        const value = feature.properties[property]
        if (value > acc) {
          acc = value
        }
        return acc
      },
      0
    )
    // Get the ratio for calculating density between 0 - 1000
    const ratio = 1000 / highestPropertyValue
    // Update density based on ratio for each state
    const features = geoJson.features.reduce((acc, feature) => {
      const propertyValue = feature.properties[property]
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
    commit('SET_PROPERTY', property)
  },
  setSelectedState({ commit }, state) {
    commit('SET_SELECTED_STATE', state)
  }
}

const getters = {
  geoJson: (state) => {
    return state.geoJson
  },
  property: (state) => {
    return state.property
  },
  highestState: (state) => {
    if (!state.property) {
      return {}
    }
    return state.geoJson.features.reduce((acc, feature) => {
      if (acc.properties[state.property] < feature.properties[state.property]) {
        acc = feature
      }
      return acc
    }, state.geoJson.features[0])
  },
  lowestState: (state) => {
    if (!state.property) {
      return {}
    }
    return state.geoJson.features.reduce((acc, feature) => {
      if (acc.properties[state.property] > feature.properties[state.property]) {
        acc = feature
      }
      return acc
    }, state.geoJson.features[0])
  },
  selectedState: (state) => {
    return state.selectedState
  }
}

const mutations = {
  SET_FEATURES(state, features) {
    state.geoJson.features = features
  },
  SET_FEATURE(state, { index, newFeature }) {
    state.geoJson.features.splice(index, 1, newFeature)
  },
  SET_PROPERTY(state, property) {
    state.property = property
  },
  SET_HIGH_VALUE(state, highestState) {
    state.highestState = highestState
  },
  SET_LOW_VALUE(state, lowestState) {
    state.lowestState = lowestState
  },
  SET_SELECTED_STATE(state, selectedState) {
    state.selectedState = selectedState
  }
}

export { actions, getters, mutations, state }
