// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign */

export const state = () => ({
  isReconnecting: true,
});
export const getters = {
  isReconnecting: (s) => s.isReconnecting,
};
export const mutations = {
  reconnecting: (s, reconnecting = true) => {
    s.isReconnecting = reconnecting;
  },
};
export const actions = {
  socket_positionUpdate({ commit }, payload) {
    commit('realtime/pushDriver', payload);
  },
  socket_rideUpdate({ commit }, payload) {
    commit('realtime/pushRide', payload);
  },
  socket_shuttleUpdate({ commit }, payload) {
    commit('realtime/pushShuttle', payload);
  },
  reconnecting({ commit }, reconnecting = true) {
    commit('reconnecting', reconnecting);
  },
  updateConnectedDrivers({ commit }, payload) {
    commit('realtime/setConnectedDrivers', payload);
  },
};
