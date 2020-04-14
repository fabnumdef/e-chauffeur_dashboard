function arrivalIndex(arr) {
  const { length } = arr;
  if (length > 1) {
    return length - 1;
  }
  return 1;
}

export default () => ({
  computed: {
    departure: {
      get() {
        return this.shuttle.stops[0];
      },
      set(stop) {
        this.shuttle.stops.splice(0, 1, { ...stop, passengers: [] });
      },
    },
    arrival: {
      get() {
        return this.shuttle.stops[arrivalIndex(this.shuttle.stops)];
      },
      set(stop) {
        this.shuttle.stops.splice(arrivalIndex(this.shuttle.stops), 1, { ...stop, passengers: [] });
      },
    },
    stops() {
      return this.shuttle.pattern.stops.reduce((acc, stop) => {
        const alreadyIn = !!acc.find((s) => s.id === stop.id);
        if (!alreadyIn) {
          acc.push(stop);
        }
        return acc;
      }, []) || [];
    },
  },
  methods: {
    updateStops(stops) {
      this.shuttle.stops = stops;
    },
  },
});
