import debounce from 'lodash.debounce';
import toggleLoading from '~/helpers/mixins/toggle-loading';
import errorsManagementMixin from '~/helpers/mixins/errors-management';

export default (entity, {
  key = entity, mask = ',', listQuery = ((api, options = {}) => api.query(entity)
    .setMask(mask)
    .list()
    .setOffset(0)
    .setLimit(30)
    .setSearchTerm(options.search)),
} = {}) => ({
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
      list: this[key] || (this.value ? [].concat(this.value) : []),
    };
  },
  async mounted() {
    if (this[key]) {
      return;
    }
    this.toggleLoading(true);
    await this.handleCommonErrorsBehavior(async () => {
      const { data } = await listQuery(this.$api);
      this.list = data;
    });
    this.toggleLoading(false);
  },
  methods: {
    updateList: debounce(async function updateList(search) {
      this.toggleLoading(true);
      await this.handleCommonErrorsBehavior(async () => {
        const { data } = await listQuery(this.$api, { search });
        this.list = data;
      });
      this.toggleLoading(false);
    }, 500),
  },
});
