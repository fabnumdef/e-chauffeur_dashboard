import searchFilter from '~/components/form/search-filter.vue';

/* Due to limited mixin features of nuxt, this search filter needs update-list mixin. */
/* Add it in template with this code : <search-filter @update="search" :value="searchTerms"/> */
export default () => ({
  components: {
    searchFilter,
  },
  methods: {
    async search(val) {
      await this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        query: { ...this.$route.query, search: val },
      });
    },
  },
});
