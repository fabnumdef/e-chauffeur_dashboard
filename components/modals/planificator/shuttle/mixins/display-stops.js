export default () => ({
  data() {
    return {
      toDisplay: this.parentStops.map(() => false),
    };
  },
  methods: {
    passengersCountClass(stop) {
      const diff = this.capacity - stop.passengers.length;
      if (diff < 3 && diff > 0) {
        return 'warning';
      }
      if (diff <= 0) {
        return 'error';
      }
      return '';
    },
    displayDetails(index) {
      this.toDisplay.splice(index, 1, !this.toDisplay[index]);
    },
    nextStop(index) {
      if (index === this.stops.length - 1) {
        return null;
      }
      return this.stops[index + 1];
    },
  },
});
