import exportButton from '~/components/crud/export-button.vue';

export default (queryName, { mask = 'id', exportMethod = 'exportQuery', customQuery = (q) => q } = {}) => ({
  components: {
    exportButton,
  },
  computed: {
    [exportMethod]() {
      return customQuery.call(
        this,
        this.$api.query(queryName).setMask(mask),
        { query: this.$route.query, params: this.$route.params },
      );
    },
  },
});
