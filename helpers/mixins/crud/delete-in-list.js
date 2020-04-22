export default (queryName, { confirmation = 'Voulez vous vraiment supprimer cette donnée ?' } = {}) => ({
  methods: {
    async deleteRow({ id }) {
      if (window && window.confirm(confirmation)) {
        await this.$api.query(queryName).delete(id);
        if (this.updateList) {
          this.updateList();
        }
      }
    },
  },
});
