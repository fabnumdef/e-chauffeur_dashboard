export default (queryName, {
  defaultOffset = 0,
  defaultLimit = 30,
  dataKey = 'data',
  paginationKey = 'pagination',
  updateKey = 'updateList',
  querySearch = 'search',
  mask,
  customList = (v) => v,
  customQuery = (v) => v,
} = {}) => ({
  watchQuery: ['offset', 'limit', querySearch, 'searchDrivers', 'searchUsers'],
  async asyncData({ $api, query, params }) {
    const { data, pagination } = await customList(
      customQuery(
        $api.query(queryName)
          .setMask(mask), { query, params },
      )
        .list()
        .setSearchTerm(query[querySearch] || null)
        .setOffset(parseInt(query.offset, 10) || defaultOffset)
        .setLimit(parseInt(query.limit, 10) || defaultLimit), { query, params },
    );
    return {
      [`${querySearch}Terms`]: query[querySearch],
      [dataKey]: data,
      [paginationKey]: pagination,
    };
  },
  methods: {
    async [updateKey]() {
      const { data, pagination } = await customList(
        customQuery(
          this.$api
            .query(queryName)
            .setMask(mask),
          { query: this.$route.query, params: this.$route.params },
        )
          .list()
          .setSearchTerm(this.$route.query[querySearch] || null)
          .setOffset(parseInt(this.$route.query.offset, 10) || defaultOffset)
          .setLimit(parseInt(this.$route.query.limit, 10) || defaultLimit),
        { query: this.$route.query, params: this.$route.params },
      );
      Object.assign(this, {
        [dataKey]: data,
        [paginationKey]: pagination,
      });
    },
  },
});
