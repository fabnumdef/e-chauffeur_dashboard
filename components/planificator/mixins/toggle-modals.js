export default () => ({
  data() {
    return {
      modalOpen: {
        ride: false,
        shuttle: false,
      },
    };
  },
  methods: {
    toggleRideModal(newStatus = false) {
      this.modalOpen.ride = newStatus;
    },
    toggleShuttleModal(newStatus = false) {
      this.modalOpen.shuttle = newStatus;
    },
  },
});
