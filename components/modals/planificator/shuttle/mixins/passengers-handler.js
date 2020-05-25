export default () => ({
  computed: {
    capacity() {
      if (this.shuttle.car && this.shuttle.car.model && this.shuttle.car.model.capacity) {
        return this.shuttle.car.model.capacity;
      }
      return 0;
    },
  },
  methods: {
    updatePassengers(passengers) {
      this.shuttle.passengers = passengers;
    },
  },
});
