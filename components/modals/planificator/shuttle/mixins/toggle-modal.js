export default () => ({
  methods: {
    toggleModal(val) {
      if (!val) {
        this.$emit('toggle-modal', val);
      }
    },
  },
});
