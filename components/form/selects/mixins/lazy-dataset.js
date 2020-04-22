import debounce from 'lodash.debounce';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';

export default (entity, { key = entity, mask = ',' } = {}) => ({
  mixins: [
    toggleLoading(),
    errorsManagementMixin(),
  ],
  props: {
    [key]: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      list: this[key] || this.value || [],
    };
  },
  async mounted() {
    if (this[key]) {
      return;
    }
    this.toggleLoading(true);
    await this.handleCommonErrorsBehavior(async () => {
      const { data } = await this.$api.query(entity).setMask(mask).list();
      this.list = data;
    });
    this.toggleLoading(false);
  },
  methods: {
    updateList: debounce(async function updateList(search) {
      this.toggleLoading(true);
      await this.handleCommonErrorsBehavior(async () => {
        const { data } = await this.$api.query(entity)
          .setMask(mask)
          .list()
          .setOffset(0)
          .setLimit(30)
          .setSearchTerm(search);
        this.list = data;
      });
      this.toggleLoading(false);
    }, 500),
  },
});
