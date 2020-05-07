import Vue from 'vue';
import { mapGetters } from 'vuex';
import merge from 'lodash.merge';

Vue.mixin({
  computed: {
    ...mapGetters({ hasCampus: 'context/hasCampus' }),
  },
  methods: {
    campusLink(name, ...mergables) {
      if (!this.hasCampus) {
        return null;
      }
      const campus = this.$store.getters['context/campus'];
      return merge({
        name: `campus-${name}`,
        params: { campus: campus.id },
      }, ...mergables);
    },
  },
});
