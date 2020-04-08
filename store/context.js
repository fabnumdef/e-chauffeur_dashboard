// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign */

export const state = () => ({
  campus: null,
  meta: {},
  hideMap: false,
});

export const mutations = {
  setCampus: (s, campus = null) => {
    s.campus = campus;
  },
  hideMap: (s, hide) => {
    s.hideMap = hide;
  },
  setMeta: (s, meta = {}) => {
    s.meta = meta;
  },
};

export const getters = {
  hasCampus: (s) => s.campus !== null,
  isCampus: (s) => (id) => typeof s.campus === 'object' && !!s.campus && s.campus.id === id,
  campus: (s) => s.campus,
  hideMap: (s) => s.hideMap,
  meta: (s) => s.meta,
};

export const actions = {
  async fetchCampus({ commit }, campus) {
    if (!campus) {
      commit('setCampus', null);
      return;
    }
    const { data } = await this.$api.query('campuses')
      .setMask(
        'id,name,location,categories(id,label),workedDays,workedHours,defaultRideDuration,defaultReservationScope',
      )
      .get(campus);
    commit('setCampus', data);
  },
  hideMap({ commit }, hide) {
    commit('hideMap', hide);
  },
};
