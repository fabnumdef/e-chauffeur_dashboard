export default () => ({
  data() {
    return {
      departure: null,
      arrival: null,
      email: '',
      phone: '',
    };
  },
  methods: {
    addPassenger() {
      if (this.email && this.departure && this.arrival) {
        const departure = this.stops.find((stop) => stop.id === this.departure.id);
        const arrival = this.stops.find((stop) => stop.id === this.arrival.id);
        if (departure && arrival) {
          const passenger = {
            email: this.email,
            departure: {
              id: departure.id,
              label: departure.label,
            },
            arrival: {
              id: arrival.id,
              label: arrival.label,
            },
          };

          if (this.phone) {
            passenger.phone = this.phone;
          }

          this.passengers.push(passenger);
        }
        this.resetState();
        this.$emit('update-passengers', this.passengers);
      } else {
        this.$toast.error('Veuillez compléter l\'email, l\'arrêt de départ et l\'arrêt d\'arrivée');
      }
    },
    deletePassenger(passenger) {
      this.passengers.splice(this.passengers.findIndex(({ email }) => email === passenger.email), 1);
      this.$emit('update-passengers', this.passengers);
    },
  },
});
