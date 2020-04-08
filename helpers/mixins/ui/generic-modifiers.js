export const COLORS = [
  'primary',
  'link',
  'info',
  'success',
  'warning',
  'danger',
];

export const GRAYSCALE = [
  'white',
  'light',
  'dark',
  'black',
];

export const STATES = [
  'focused',
  'hovered',
  'active',
  'loading',
  'static',
];

export const TEXT = 'text';

export default (key, ...classModifiers) => ({
  props: {
    ...classModifiers.reduce(
      (acc, curr) => Object.assign(acc, { [curr]: { type: Boolean, default: false } }),
      {},
    ),
  },
  computed: {
    [key]() {
      return {
        ...classModifiers.reduce(
          (acc, curr) => Object.assign(acc, { [`is-${curr}`]: !!this[curr] }),
          {},
        ),
      };
    },
  },
});
