import { DateTime } from 'luxon';

const SHUTTLE = 'shuttle';

export default () => ({
  methods: {
    isShuttle(item) {
      return !!item.shuttle;
    },
    updateShuttleDates(start, end, driver = {}) {
      this.shuttle.driver = driver;
      this.shuttle.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.shuttle.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },
    updateShuttle(shuttle) {
      this.reset(SHUTTLE);
      this.shuttle = {
        ...this.shuttle,
        ...shuttle,
      };
      this.toggleShuttleModal(true);
    },
    newShuttle(...args) {
      this.reset();
      this.updateShuttleDates(...args);
      this.toggleShuttleModal(true);
    },
  },
});
