export default ({ defaultTimeout = 1500 } = {}) => ({
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    toggleLoading(val) {
      this.loading = val;
    },
    async raceToggleLoading(...promises) {
      this.toggleLoading(true);
      try {
        await Promise.all([
          ...promises.map((p) => p.call(this)),
          new Promise(((resolve) => setTimeout(resolve, defaultTimeout))),
        ]);
      } finally {
        this.toggleLoading(false);
      }
    },
  },
});
