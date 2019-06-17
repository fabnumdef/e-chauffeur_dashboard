// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign */

import { DateTime } from 'luxon';

export const state = () => ({
  drivers: [],
  rides: [],
});

export const mutations = {
  setDrivers: (s, drivers = []) => {
    s.drivers = drivers;
  },

  setRides: (s, rides = []) => {
    s.rides = rides;
  },

  pushDriver: (s, driver) => {
    if (!driver.id) {
      throw new Error('User id is required');
    }
    const i = s.drivers.findIndex(d => driver.id === d.id);

    if (i === -1) {
      s.drivers.push(driver);
    } else {
      Object.assign(s.drivers[i], driver);
    }
  },

  pushRide: (s, ride) => {
    if (!ride.id) {
      throw new Error('Id is required');
    }
    const i = s.rides.findIndex(({ id }) => id === ride.id);
    if (i === -1) {
      s.rides.push(ride);
    } else {
      Object.assign(s.rides[i], ride);
    }
  },
};

export const getters = {
  drivers: s => s.drivers,
  rides: s => s.rides,
};

export const actions = {
  async fetchDrivers({ commit }, campus) {
    try {
      const { data } = await this.$api.rides(
        campus.id,
      ).getDriversPositions('id,name,date,position(coordinates)');
      commit('setDrivers', data);
    } catch (e) {
      throw new Error('Drivers fetching failed');
    }
  },
};
