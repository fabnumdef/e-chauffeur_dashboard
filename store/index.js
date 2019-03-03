export const state = () => ({});
export const actions = {
  socket_positionUpdate({ commit }, payload) {
    commit('realtime/pushDriver', payload);
  },
  socket_rideUpdate({ commit }, payload) {
    commit('realtime/pushRide', payload);
  },
};
