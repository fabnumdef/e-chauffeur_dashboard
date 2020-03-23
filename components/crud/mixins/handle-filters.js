export default {
  data() {
    return {
      fieldFilter: null,
      contentFilter: null,
    };
  },
  computed: {
    fieldContent() {
      return this.fieldFilter ? this.data.reduce((acc, data) => {
        if (!acc.find((d) => d === data[this.fieldFilter.id])) {
          acc.push(data[this.fieldFilter.id]);
        }
        return acc;
      }, []) : [];
    },
    filteredData() {
      return this.contentFilter
        ? this.data.filter((user) => user[this.fieldFilter.id] === this.contentFilter)
        : this.data;
    },
  },
  methods: {
    updateFieldFilter(data) {
      this.fieldFilter = data;
    },
    updateContentFilter(data) {
      this.contentFilter = data;
    },
    reset() {
      this.fieldFilter = null;
      this.contentFilter = null;
    },
  },
};
