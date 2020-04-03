// import states from '~/static/data/states.json'
import geoJson from '~/static/data/stateGeoJson.json'

const state = () => ({
  geoJson
})

const actions = {
  // setDensityByProp({ commit }, property) {
  //   // todo
  //   // console.log('setDensityByProp: ', property)
  //   // find the max value of all items first. then you can set everything from 0-100, two loops
  // }
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
