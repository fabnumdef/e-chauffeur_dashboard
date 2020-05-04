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
    interStops() {
      return this.stops.reduce((acc, stop, index) => {
        const departure = stop;
        const arrival = this.nextStop(index);
        const incomingPassengers = this.passengers.filter((passenger) => passenger.departure.id === departure.id);
        if (index === 0) {
          acc.push({ departure, arrival, passengers: incomingPassengers });
        } else if (arrival) {
          let previousPassengers = [];
          if (acc[index - 1].passengers.length > 0) {
            previousPassengers = acc[index - 1].passengers.filter((passenger) => passenger.arrival.id !== departure.id);
          }
          const passengers = [
            ...previousPassengers,
            ...incomingPassengers,
          ];
          acc.push({ departure, arrival, passengers });
        }

        return acc;
      }, []);
    },
  },
  methods: {
    resetState() {
      this.departure = null;
      this.arrival = null;
      this.email = '';
      this.phone = '';
    },
    setHover(stopIndex, passengerIndex) {
      this.hover.stopIndex = stopIndex;
      this.hover.passengerIndex = passengerIndex;
    },
    passengersCountClass(passengers) {
      const diff = this.capacity - passengers.length;
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
