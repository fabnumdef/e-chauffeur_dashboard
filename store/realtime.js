// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign,no-shadow */
import { DateTime } from 'luxon';
import { CREATED } from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

const EDITABLE_FIELDS = [
  'id',
  'start',
  'end',
  'departure(id,label)',
  'arrival(id,label)',
  'car(id,label,model(id,label))',
  'driver(id,name,firstname,lastname)',
  'owner(id)',
  'phone',
  'status',
  'userComments',
  'comments',
  'passengersCount',
  'category(id,label)',
  'luggage',
].join(',');

export const state = () => ({
  connectedDrivers: [],
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
    const i = s.drivers.findIndex((d) => driver.id === d.id);
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

  setConnectedDrivers: (s, { ids, connected }) => {
    if (ids.length > 1) {
      s.connectedDrivers = ids;
    }
    const i = s.connectedDrivers.findIndex((driverId) => driverId === ids[0]);
    if (i === -1 && connected) {
      s.connectedDrivers.push(ids[0]);
    } else if (i !== -1 && !connected) {
      s.connectedDrivers.splice(i, 1);
    }
  },
};

export const getters = {
  drivers: (s) => s.drivers,
  connectedDrivers: (s) => s.connectedDrivers,
  rides: (s) => s.rides,
  ridesToValidate: (s) => s.rides.filter(({ status }) => status === CREATED),
  todayRides: ({ rides }) => {
    const currentTime = DateTime.local();
    return rides.filter((r) => DateTime.fromISO(r.start).hasSame(currentTime, 'day')
      || DateTime.fromISO(r.end).hasSame(currentTime, 'day'));
  },
};

export const actions = {
  async fetchDrivers({ commit }, campus) {
    try {
      const { data } = await this.$api
        .query('rides')
        .setCampus(campus.id)
        .setMask('id,name,date,position(coordinates)')
        .driversPositions();
      commit('setDrivers', data);
    } catch (e) {
      throw new Error('Drivers fetching failed');
    }
  },
  async setRides({ commit }, { campus, start, end }) {
    const { data: rides } = await this.$api
      .query('rides')
      .setCampus(campus)
      .setMask(EDITABLE_FIELDS)
      .list(start, end);
    commit('setRides', rides);
  },

  async appendRides({ commit }, { campus, start, end }) {
    const { data: rides } = await this.$api
      .query('rides')
      .setCampus(campus)
      .setMask(EDITABLE_FIELDS)
      .list(start, end);
    rides.forEach((r) => commit('pushRide', r));
  },
};
