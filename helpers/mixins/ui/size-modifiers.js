export const SIZES = [
  'small',
  'normal',
  'medium',
  'large',
];

export default (key) => ({
  props: {
    size: {
      type: String,
      validator: (v) => SIZES.indexOf(v) !== -1,
    },
  },
  computed: {
    [key]() {
      return {
        ...SIZES.reduce(
          (acc, curr) => Object.assign(acc, { [`is-${curr}`]: curr === this.size }),
          {},
        ),
      };
    },
  },
});
