import { DateTime } from 'luxon';
import {
  DELIVERED, IN_PROGRESS, WAITING, STARTED, ACCEPTED, VALIDATED,
  REJECTED_BOUNDARY, REJECTED_CAPACITY,
  CANCELED_TECHNICAL,
  CANCELED_REQUESTED_CUSTOMER,
  CANCELED_CUSTOMER_OVERLOAD,
  CANCELED_CUSTOMER_MISSING, CREATED,
} from '@fabnumdef/e-chauffeur_lib-vue/api/status/states';

const generateEmptyRide = () => ({
  start: null,
  end: null,
  phone: null,
  departure: null,
  arrival: null,
  driver: null,
  status: CREATED,
  category: null,
  passengersCount: 1,
  luggage: false,
  comments: '',
});

export default () => ({
  data() {
    return {
      ride: generateEmptyRide(),
    };
  },
  methods: {
    isRide(item) {
      return item.departure && item.arrival;
    },
    initRide() {
      this.ride = generateEmptyRide();
      if (this.campus.categories.length > 0) {
        [this.ride.category] = this.campus.categories;
      }
    },
    updateRideDates(start, end, driver = {}) {
      this.ride.driver = driver;
      this.ride.start = start instanceof DateTime ? start : DateTime.fromJSDate(start);
      this.ride.end = end instanceof DateTime ? end : DateTime.fromJSDate(end);
    },
    updateRide(ride) {
      this.ride = Object.assign(generateEmptyRide(), ride);
      this.toggleRideModal(true);
    },
    newRide(...args) {
      this.initRide();
      this.updateRideDates(...args);
      this.toggleRideModal(true);
    },
    eventStatusClass(event) {
      switch (event.status) {
        case DELIVERED:
          return 'event-status-done';
        case STARTED:
        case IN_PROGRESS:
          return 'event-status-driving';
        case WAITING:
          return 'event-status-waiting';
        case REJECTED_CAPACITY:
        case REJECTED_BOUNDARY:
        case CANCELED_TECHNICAL:
        case CANCELED_CUSTOMER_MISSING:
        case CANCELED_CUSTOMER_OVERLOAD:
        case CANCELED_REQUESTED_CUSTOMER:
          return 'event-status-wrong';
        case ACCEPTED:
          return 'event-status-accepted';
        case VALIDATED:
        default:
          return 'event-status-planned';
      }
    },
  },
});
