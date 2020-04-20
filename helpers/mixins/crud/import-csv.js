import errorsManagementMixin from '~/helpers/mixins/errors-management';
import importButton from '~/components/crud/import-button.vue';

export default (queryName) => ({
  mixins: [
    errorsManagementMixin(),
  ],
  components: {
    importButton,
  },
  methods: {
    async importCSV({ data, params }) {
      await this.handleCommonErrorsBehavior(async () => {
        await this.$api.query(queryName).batch(data, { params });
        this.$toast.success('Import réalisé avec succès');
      });
      if (this.updateList) {
        this.updateList();
      }
    },
  },
});
