// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign,no-shadow */
import { DateTime } from 'luxon';
import { CREATED } from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

const RIDE_MASK = [
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

const SHUTTLE_MASK = 'id,label,status,start,end,campus,shuttleFactory,comments,stops,driver,car,passengers';


export const state = () => ({
  connectedDrivers: [],
  drivers: [],
  rides: [],
  shuttles: [],
});

export const mutations = {
  setDrivers: (s, drivers = []) => {
    s.drivers = drivers;
  },

  setRides: (s, rides = []) => {
    s.rides = rides;
  },

  setShuttles: (s, shuttles = []) => {
    s.shuttles = shuttles;
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

  pushShuttle: (s, shuttle) => {
    if (!shuttle.id) {
      throw new Error('Id is required');
    }
    const i = s.shuttles.findIndex(({ id }) => id === shuttle.id);
    if (i === -1) {
      s.shuttles.push(shuttle);
    } else {
      Object.assign(s.shuttles[i], shuttle);
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
  shuttles: (s) => s.shuttles,
  displacements: (s) => [...s.rides, ...s.shuttles],
  displacementsToValidate: (s) => [
    ...s.rides.filter(({ status }) => status === CREATED),
    // @todo think of a way to notify passenger validation in shuttles
  ],
  todayDisplacements: (s) => {
    const currentTime = DateTime.local();
    const rides = s.rides.filter((r) => DateTime.fromISO(r.start).hasSame(currentTime, 'day')
      || DateTime.fromISO(r.end).hasSame(currentTime, 'day'));
    const shuttles = s.shuttles.filter((r) => DateTime.fromISO(r.start).hasSame(currentTime, 'day')
      || DateTime.fromISO(r.end).hasSame(currentTime, 'day'));
    return [...rides, ...shuttles];
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
  async setDisplacements({ commit }, { campus, start, end }) {
    return Promise.all([
      (async () => {
        const { data: rides } = await this.$api
          .query('rides')
          .setMask(RIDE_MASK)
          .setCampus(campus)
          .list(start, end);
        commit('setRides', rides);
      })(),
      (async () => {
        const { data: shuttles } = await this.$api
          .query('shuttles')
          .setMask(SHUTTLE_MASK)
          .setCampus(campus)
          .list(start, end);
        commit('setShuttles', shuttles);
      })(),
    ]);
  },

  async appendDisplacements({ commit }, { campus, start, end }) {
    return Promise.all([
      (async () => {
        const { data: rides } = await this.$api
          .query('rides')
          .setMask(RIDE_MASK)
          .setCampus(campus)
          .list(start, end);
        rides.forEach((r) => commit('pushRide', r));
      })(),
      (async () => {
        const { data: shuttles } = await this.$api
          .query('shuttles')
          .setMask(SHUTTLE_MASK)
          .setCampus(campus)
          .list(start, end);
        shuttles.forEach((s) => commit('pushShuttle', s));
      })(),
    ]);
  },
};
