<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    ancestor: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Boolean,
      default: false,
    },
    child: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: null,
    },
  },
  computed: {
    classes() {
      const component = this.$vnode.tag;

      const child = this.child || (this.$slots.default && !this.$slots.default.find((s) => s.tag === component));
      const flags = {
        tile: true,
        'is-ancestor': this.ancestor,
        'is-parent': this.parent,
        'is-vertical': this.vertical,
        'is-child': child,
      };
      if (this.size !== null) {
        flags[`is-${this.size}`] = true;
      }
      return flags;
    },
  },
  render(h) {
    return h(
      this.tag,
      {
        class: this.classes,
      },
      this.$slots.default,
    );
  },
};
</script>
<style scoped lang="scss">
  @import "~assets/css/head";
  @import "~bulma/sass/grid/tiles.sass";
</style>
