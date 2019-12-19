// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign */

export const state = () => ({
  campus: null,
  hideMap: false,
});

export const mutations = {
  setCampus: (s, campus = null) => {
    s.campus = campus;
  },
  hideMap: (s, hide) => {
    s.hideMap = hide;
  },
};

export const getters = {
  hasCampus: (s) => s.campus !== null,
  isCampus: (s) => (id) => typeof s.campus === 'object' && !!s.campus && s.campus.id === id,
  campus: (s) => s.campus,
  hideMap: (s) => s.hideMap,
};

export const actions = {
  async fetchCampus({ commit }, campus) {
    if (!campus) {
      commit('setCampus', null);
      return;
    }
    const { data } = await this.$api.campuses.getCampus(campus,
      'id,name,location,categories(id,label),workedDays,workedHours,defaultRideDuration,defaultReservationScope');
    commit('setCampus', data);
  },
  hideMap({ commit }, hide) {
    commit('hideMap', hide);
  },
};
