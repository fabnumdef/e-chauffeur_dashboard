import { DateTime } from 'luxon';
import { CREATED } from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

const generateEmptyShuttle = () => ({
  start: null,
  end: null,
  phone: null,
  driver: null,
  status: CREATED,
  category: null,
  passengers: [],
  comments: '',
  shuttleFactory: {
    id: null,
    label: null,
    stops: [],
  },
});

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
      this.shuttle = Object.assign(generateEmptyShuttle(), shuttle);
      this.toggleShuttleModal(true);
    },
    newShuttle(...args) {
      this.shuttle = generateEmptyShuttle();
      this.updateShuttleDates(...args);
      this.toggleShuttleModal(true);
    },
  },
});
