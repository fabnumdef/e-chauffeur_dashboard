import searchFilter from '~/components/form/search-filter.vue';

/* Due to limited mixin features of nuxt, this search filter needs update-list mixin. */
/* Add it in template with this code : <search-filter @update="search" :value="searchTerms"/> */
export default ({ methodName = 'search', querySearch = 'search' } = {}) => ({
  components: {
    searchFilter,
  },
  methods: {
    async [methodName](val) {
      await this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        query: { ...this.$route.query, [querySearch]: val, offset: undefined },
      });
    },
  },
});
