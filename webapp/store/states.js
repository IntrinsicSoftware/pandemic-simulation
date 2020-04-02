import states from '~/static/data/states.json'
import geoJson from '~/static/data/stateGeoJson.json'

const state = () => ({
  geoJson
})

const actions = {
  setDensityByProp({ commit }, property) {
    // todo
    console.log('setDensityByProp: ', property)
  }
}

const getters = {
  geoJson: (state) => {
    return state.geoJson
  }
}

const mutations = {
  SET(state, geoJson) {
    state.geoJson = geoJson
  }
}

export { actions, getters, mutations, state }
