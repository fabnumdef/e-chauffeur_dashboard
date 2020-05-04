export default () => ({
  methods: {
    validateShuttleFactory() {
      this.shuttle.stops = this.shuttle.shuttleFactory.stops.map(({ id, label }) => ({
        id,
        label,
        passengers: [],
      }));
    },
  },
});
