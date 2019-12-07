// We've to disable param reassign, because it's the common behavior of vuex
/* eslint-disable no-param-reassign */

export const state = () => ({
  selectedDate: null,
});

export const mutations = {
  setSelectedDate: (s, date) => {
    s.selectedDate = date;
  },
};

export const getters = {
  getSelectedDate: (s) => s.selectedDate,
};
