export default (queryName, {
  confirmation = 'Voulez vous vraiment supprimer cette donnée ?',
  deleteMethod = 'deleteRow',
  updateMethod = 'updateList',
  customList = (v) => v,
  customQuery = (v) => v,
} = {}) => ({
  methods: {
    async [deleteMethod]({ id }) {
      if (window && window.confirm(confirmation)) {
        await customList(
          customQuery(
            this.$api.query(queryName),
            { query: this.$route.query, params: this.$route.params },
          ).delete(id),
          { query: this.$route.query, params: this.$route.params },
        );
        if (updateMethod && this[updateMethod]) {
          this[updateMethod]();
        }
      }
    },
  },
});
