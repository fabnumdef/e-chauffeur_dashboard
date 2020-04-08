export default (initializer) => ({
  data() {
    return initializer.call(this);
  },
  methods: {
    reset() {
      Object.assign(this, initializer.call(this));
    },
  },
});
