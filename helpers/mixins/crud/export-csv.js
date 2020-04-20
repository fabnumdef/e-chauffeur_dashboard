import exportButton from '~/components/crud/export-button.vue';

export default (queryName, { mask = 'id' } = {}) => ({
  components: {
    exportButton,
  },
  computed: {
    exportQuery() {
      return this.$api.query(queryName).setMask(mask);
    },
  },
});
