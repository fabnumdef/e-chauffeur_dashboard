export default () => ({
  data() {
    return {
      toDisplay: this.parentStops.map(() => false),
      hover: {
        stopIndex: -1,
        passengerIndex: -1,
      },
    };
  },
  computed: {
    isHovered(stopIndex, passengerIndex) {
      return this.hover.stopIndex === stopIndex && this.hover.passengerIndex === passengerIndex;
    },
  },
  methods: {
    setHover(stopIndex, passengerIndex) {
      this.hover.stopIndex = stopIndex;
      this.hover.passengerIndex = passengerIndex;
    },
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
