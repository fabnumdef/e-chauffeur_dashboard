export default ({ query, mask, key }) => ({
  async asyncData({ params, $api }) {
    const { data } = await $api.query(query).setMask(mask).get(params.id);
    return {
      [key]: data,
    };
  },
  render(createElement) {
    return createElement('nuxt-child', { attrs: { [key]: this[key] } });
  },
});
