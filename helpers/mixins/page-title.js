export default (title = null, subtitle = null) => ({
  meta: {
    title,
    subtitle,
  },
  head: {
    title,
  },
});
