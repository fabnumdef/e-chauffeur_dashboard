import { mapMutations } from 'vuex';

export default (defaultTitle = null, defaultSubtitle = null) => ({
  meta: {
    title: defaultTitle,
    subtitle: defaultSubtitle,
  },
  head() {
    return {
      title: defaultTitle,
    };
  },
  methods: {
    ...mapMutations({
      setMeta: 'context/setMeta',
    }),
    setTitle(title, subtitle) {
      this.setMeta({ title, subtitle });
    },
  },
});
