export default () => ({
  data() {
    return {
      modalOpen: {
        ride: false,
        shuttle: false,
        type: false,
      },
      event: null,
    };
  },
  methods: {
    toggleRideModal(newStatus = false) {
      this.modalOpen.ride = newStatus;
    },
    toggleShuttleModal(newStatus = false) {
      this.modalOpen.shuttle = newStatus;
    },
    openTypeModal(event = {}) {
      if (event.split && event.split > 1) {
        const isShuttleSplit = !!this.splitDrivers[event.split - 1].class.includes('heavy-weight');
        if (isShuttleSplit) {
          this.event = event;
          this.modalOpen.type = true;
        } else {
          this.modalOpen.ride = true;
        }
      }
    },
    closeTypeModal() {
      this.modalOpen.type = false;
    },
  },
});
