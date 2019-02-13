// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign */

export const state = () => ({
  campus: null,
});

export const mutations = {
  setCampus: (s, campus = null) => {
    s.campus = campus;
  },
};

export const getters = {
  hasCampus: s => s.campus !== null,
  isCampus: s => id => typeof s.campus === 'object' && !!s.campus && s.campus.id === id,
  campus: s => s.campus,
};

export const actions = {
  async fetchCampus({ commit }, campus) {
    const { data } = await this.$api.campuses.getCampus(campus, 'id,name,location');
    commit('setCampus', data);
  },
};
