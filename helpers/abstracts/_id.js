export default ({
  query, mask, key, customGet = (q) => q, customQuery = (q) => q,
} = {}) => ({
  async asyncData({ $api, store, params }) {
    const { data } = await customGet(
      customQuery(
        $api.query(query).setMask(mask),
        { store, params },
      ).get(params.id),
      { store, params },
    );
    return {
      [key]: data,
    };
  },
  render(createElement) {
    return createElement('nuxt-child', { attrs: { [key]: this[key] } });
  },
});
