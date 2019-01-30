// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign */

export const state = () => ({
  drivers: [],
});

export const mutations = {
  setDrivers: (s, drivers = []) => {
    s.drivers = drivers;
  },
  pushDriver: (s, { user: { id }, position, date }) => {
    if (!id) {
      throw new Error('User id is required');
    }
    const i = s.drivers.findIndex(d => id === d.id);

    const o = { id, position: { coordinates: position }, date };
    if (i === -1) {
      s.drivers.push(o);
    } else {
      Object.assign(s.drivers[i], o);
    }
  },
};

export const getters = {
  drivers: s => s.drivers,
};

export const actions = {
  async fetchDrivers({ commit }, campus) {
    try {
      const { data } = await this.$api.rides(
        campus.id,
      ).getDriversPositions('id,date,position(coordinates)');
      commit('setDrivers', data);
    } catch (e) {
      throw new Error('Drivers fetching failed');
    }
  },
};
