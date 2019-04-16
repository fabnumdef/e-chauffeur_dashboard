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
  ridesCalendar: s => s.rides.map((ride) => {
    const start = DateTime.fromISO(ride.start).setLocale('fr')
      .toFormat('yyyy-LL-dd HH:mm');
    const end = DateTime.fromISO(ride.end).setLocale('fr')
      .toFormat('yyyy-LL-dd HH:mm');
    const title = `${ride.departure.label} -> ${ride.arrival.label}`;
    const content = `De ${ride.departure.label} à ${ride.arrival.label}`;
    const split = s.drivers.findIndex(driver => driver.id === ride.driver.id);
    return {
      start,
      end,
      title,
      content,
      ride,
      split,
      class: 'grey',
    };
  }),
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
