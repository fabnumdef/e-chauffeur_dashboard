import { DateTime } from 'luxon';
import { generateEmptyShuttle } from '../helpers/generate-empty';

export default () => ({
  data() {
    return {
      shuttle: generateEmptyShuttle(),
    };
  },
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
      let stops = [];
      if (shuttle.stops.length === 0) {
        stops = shuttle.pattern.stops.map((stop) => ({ ...stop, passengers: [] }));
      } else {
        stops = shuttle.stops.map((stop) => ({ ...stop, passengers: [...stop.passengers] }));
      }

      const updatedShuttle = { ...shuttle, stops: [...stops] };
      this.shuttle = { ...generateEmptyShuttle(), ...updatedShuttle };

      this.toggleShuttleModal(true);
    },
    newShuttle(...args) {
      this.shuttle = generateEmptyShuttle();
      this.updateShuttleDates(...args);
      this.toggleShuttleModal(true);
    },
  },
});
