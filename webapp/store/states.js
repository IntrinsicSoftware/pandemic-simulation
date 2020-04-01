import states from '~/static/data/states.json';

const state = () => ({
  states
})

const getters = {
  states: (state) => {
    return state.states;
  }
}

export { state, getters }
