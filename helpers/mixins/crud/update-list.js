export default (queryName, { defaultOffset = 0, defaultLimit = 30, mask } = {}) => ({
  watchQuery: ['offset', 'limit', 'search'],
  async asyncData({ $api, query }) {
    const { data, pagination } = await $api.query(queryName)
      .setMask(mask)
      .list()
      .setSearchTerm(query.search || null)
      .setOffset(parseInt(query.offset, 10) || defaultOffset)
      .setLimit(parseInt(query.limit, 10) || defaultLimit);
    return {
      searchTerms: query.search,
      data,
      pagination,
    };
  },
  // @todo: remove
  data() {
    return {
      mask: 'id,label',
    };
  },
  methods: {
    async updateList() {
      const { data, pagination } = await this.$api
        .query(queryName)
        .setMask(mask)
        .list()
        .setSearchTerm(this.$route.query.search || null)
        .setOffset(parseInt(this.$route.query.offset, 10) || defaultOffset)
        .setLimit(parseInt(this.$route.query.limit, 10) || defaultLimit);
      Object.assign(this, { data, pagination });
    },
  },
});
