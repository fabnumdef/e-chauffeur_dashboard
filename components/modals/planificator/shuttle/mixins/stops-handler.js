import { DateTime } from 'luxon';

function calculateStopsTime(stops) {
  let distanceToStart = 0;
  return stops.map((stop) => {
    distanceToStart += stop.reachDuration;
    const time = this.shuttle.start.plus({ minutes: distanceToStart });
    return {
      ...stop,
      time,
    };
  });
}

export default () => ({
  computed: {
    start: {
      get() {
        const { start } = this.shuttle;
        return start && start.toJSDate ? start.toJSDate() : null;
      },
      set(start) {
        this.shuttle.start = DateTime.fromJSDate(start);
        this.shuttle.shuttleFactory.stops = calculateStopsTime.call(this, this.shuttle.shuttleFactory.stops);
      },
    },
  },
  methods: {
    selectShuttleFactory(shuttleFactory) {
      this.shuttle.shuttleFactory = {
        ...shuttleFactory,
        stops: calculateStopsTime.call(this, shuttleFactory.stops),
      };
    },
  },
});
