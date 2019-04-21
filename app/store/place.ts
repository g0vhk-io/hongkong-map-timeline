import axios from 'axios';

export const state = () => ({
  places: []
})

export const mutations = {
  setPlaces(state, places) {
    state.places = places;
  },
}

export const actions = {
  async getPlaces({ dispatch }, { lat, lng, radius }) {
    let places = [];
    try {
      const { data } = await axios.get(`http://localhost:1337/place?lat=${lat}&lng=${lng}&r=${radius}`);
      places = data.data.places;
    } catch (error) {
      console.error(error.message);
      console.error(error.stack);
    }
    dispatch('setPlaces', places);
  }
}