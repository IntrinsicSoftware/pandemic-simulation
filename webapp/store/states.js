import geoJson from '~/static/data/stateGeoJson.json'

const state = () => ({
  geoJson,
  property: null,
  selectedState: null,
  highestState: null,
  lowestState: null
})

const actions = {
  setDensityByProp({ commit, state }, property) {
    // Highest State
    const highestState = state.geoJson.features.reduce((acc, feature) => {
      if (acc.properties[property] < feature.properties[property]) {
        acc = feature
      }
      return acc
    }, state.geoJson.features[0])
    // Lowest State
    const lowestState = state.geoJson.features.reduce((acc, feature) => {
      if (acc.properties[property] > feature.properties[property]) {
        acc = feature
      }
      return acc
    }, state.geoJson.features[0])
    // Get the ratio for calculating density between 0 - 1000
    const ratio = 1000 / highestState.properties[property]
    // Update density based on ratio for each state
    geoJson.features.forEach((feature, index) => {
      if (feature.properties[property]) {
        const density = ratio * feature.properties[property]
        const newFeature = { ...feature }
        newFeature.properties = { ...feature.properties }
        newFeature.properties.density = density
        commit('SET_FEATURE', { index, newFeature })
      }
    })
    // Mutate high low and selected property
    commit('SET_PROPERTY', property)
    commit('SET_HIGH_VALUE', highestState)
    commit('SET_LOW_VALUE', lowestState)
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
    return state.highestState
  },
  lowestState: (state) => {
    return state.lowestState
  },
  selectedState: (state) => {
    return state.selectedState
  }
}

const mutations = {
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
