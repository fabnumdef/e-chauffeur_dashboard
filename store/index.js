export const state = () => ({});
export const actions = {
  socket_positionUpdate({ commit }, payload) {
    commit('realtime/pushDriver', payload);
  },
};
