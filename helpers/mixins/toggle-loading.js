export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    toggleLoading(val) {
      this.loading = val;
    },
  },
};
