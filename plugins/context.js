import Vue from 'vue';
import { mapGetters } from 'vuex';
import merge from 'lodash.merge';

export default function ({ store }, inject) {
  const context = {
    buildCampusLink: (name, ...mergables) => {
      if (!store.getters['context/hasCampus']) {
        return null;
      }
      const campus = store.getters['context/campus'];
      return merge({
        name: `campus-${name}`,
        params: { campus: campus.id },
      }, ...mergables);
    },
  };
  Vue.mixin({
    computed: {
      ...mapGetters({ hasCampus: 'context/hasCampus' }),
    },
    methods: {
      campusLink: context.buildCampusLink,
    },
  });
  inject('context', context);
}
