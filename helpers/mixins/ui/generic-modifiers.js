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

function capitalize(curr) {
  return `${curr[0].toUpperCase()}${curr.substring(1)}`;
}

export default (key, ...classModifiers) => ({
  props: {
    ...classModifiers.reduce(
      (acc, curr) => Object.assign(
        acc,
        { [`is${capitalize(curr)}`]: { type: Boolean, default: false } },
      ),
      {},
    ),
  },
  computed: {
    [key]() {
      return {
        ...classModifiers.reduce(
          (acc, curr) => Object.assign(acc, { [`is-${curr}`]: !!this[`is${capitalize(curr)}`] }),
          {},
        ),
      };
    },
  },
});
