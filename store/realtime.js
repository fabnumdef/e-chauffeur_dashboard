// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign,no-shadow */
import { DateTime } from 'luxon';
import { CREATED } from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

const rideMask = [
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

const shuttleMask = 'id,label,status,start,end,campus,shuttleFactory,comments,stops,driver,car,passengers';


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
    // @todo handle shuttles statuses
    ...s.shuttles.filter(({ status }) => status === CREATED),
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
      const { data } = await this.$api.rides(
        campus.id,
      ).getDriversPositions('id,name,date,position(coordinates)');
      commit('setDrivers', data);
    } catch (e) {
      throw new Error('Drivers fetching failed');
    }
  },
  async setDisplacements({ commit }, { campus, start, end }) {
    const { data: rides } = await this.$api.rides(campus, rideMask)
      .getRides(start, end);
    const { data: shuttles } = await this.$api.shuttles(campus, shuttleMask)
      .getShuttles(start, end);
    commit('setShuttles', shuttles);
    commit('setRides', rides);
  },

  async appendDisplacements({ commit }, { campus, start, end }) {
    const { data: rides } = await this.$api.rides(campus, rideMask)
      .getRides(start, end);
    const { data: shuttles } = await this.$api.shuttles(campus, shuttleMask)
      .getShuttles(start, end);
    shuttles.forEach((s) => commit('pushShuttle', s));
    rides.forEach((r) => commit('pushRide', r));
  },
};
