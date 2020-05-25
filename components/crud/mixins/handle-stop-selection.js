const COLUMN_KEYS = [
  { key: 'id', label: 'ID' },
  { key: 'label', label: 'Label' },
];

export default () => ({
  computed: {
    columnKeys() {
      return COLUMN_KEYS;
    },
  },
  methods: {
    deleteStop(i) {
      this.shuttleFactory.stops = this.shuttleFactory.stops.filter((_, index) => index !== i);
    },
    addStop() {
      const alreadyExists = this.shuttleFactory.stops.findIndex(({ label }) => label === this.selectedStop.label) > -1;
      if (
        !alreadyExists
        || (window && window.confirm('Attention, cet arrêt est déjà listé, êtes-vous sûr de vouloir l\'ajouter ?'))
      ) {
        this.shuttleFactory.stops.push(this.selectedStop);
        this.selectedStop = null;
      }
    },
    stopUp({ id }) {
      const { stops } = this.shuttleFactory;
      const i = stops.findIndex((stop) => stop.id === id);
      if (i > 0) {
        const a = stops[i];
        stops.splice(i, 1, stops[i - 1]);
        stops.splice(i - 1, 1, a);
      }
    },
    stopDown({ id }) {
      const { stops } = this.shuttleFactory;
      const i = stops.findIndex((stop) => stop.id === id);
      if (i < stops.length - 1) {
        const a = stops[i];
        stops.splice(i, 1, stops[i + 1]);
        stops.splice(i + 1, 1, a);
      }
    },
  },
});
