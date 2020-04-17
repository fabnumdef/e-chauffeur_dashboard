export default () => ({
  methods: {
    updateStops(stops) {
      this.shuttle.stops = stops;
    },
    validatePattern() {
      this.shuttle.stops = this.shuttle.pattern.stops.map(({ id, label }) => ({
        id,
        label,
        passengers: [],
      }));
    },
  },
});
