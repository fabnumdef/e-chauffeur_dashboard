export default () => ({
  data() {
    return {
      eventHovered: [],
    };
  },
  methods: {
    eventMouseEnter(e) {
      if (!e.background) {
        this.eventHovered[e.index] = true;
      }
    },
    eventMouseLeave(e) {
      if (!e.background) {
        this.eventHovered.splice(e.index, 1);
      }
    },
  },
});
