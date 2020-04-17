export default () => ({
  data() {
    return {
      departure: null,
      arrival: null,
      email: '',
    };
  },
  methods: {
    addPassenger() {
      if (this.email && this.departure && this.arrival) {
        let skip = false;
        this.stops = this.stops.map((stop, index) => {
          if (this.capacity - stop.passengers.length <= 0) {
            skip = true;
          }
          if (!skip && index >= this.departure.index && index < this.arrival.index) {
            stop.passengers.push({
              email: this.email,
            });
          }
          return stop;
        });
        this.departure = null;
        this.arrival = null;
        this.email = '';
        this.$emit('update-stops', this.stops);
      } else {
        this.$toast.error('Veuillez completer l\'email, l\'arret de depart et l\'arret d\'arrivee');
      }
    },
    deletePassenger(passenger) {
      this.stops = this.stops.map(({ id, label, passengers }) => ({
        id,
        label,
        passengers: passengers.filter((p) => p.email !== passenger.email),
      }));
      this.$emit('update-stops', this.stops);
    },
  },
});
