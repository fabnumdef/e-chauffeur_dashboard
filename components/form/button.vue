<template>
  <button
    v-bind="$attrs"
    class="button"
    :class="classes"
    :disabled="loading"
    v-on="$listeners"
  >
    <span>
      <slot />
    </span>
    <span
      v-if="iconRight"
      class="icon is-small"
    >
      <fa-icon :icon="iconRight" />
    </span>
  </button>
</template>
<script>
import genericModifiers, {
  COLORS, GRAYSCALE, STATES, TEXT,
} from '~/helpers/mixins/ui/generic-modifiers';
import sizeModifiers from '~/helpers/mixins/ui/size-modifiers';

export const FULLWIDTH = 'fullwidth';
export const OUTLINED = 'outlined';
export const INVERTED = 'inverted';
export const MODIFIERS = [...COLORS, ...GRAYSCALE, ...STATES, TEXT, FULLWIDTH, OUTLINED, INVERTED];

export default {
  mixins: [
    genericModifiers('modifiers', ...MODIFIERS, FULLWIDTH, OUTLINED, INVERTED),
    sizeModifiers('sizes'),
  ],
  props: {
    iconRight: {
      type: [Array, String],
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        ...this.modifiers,
        ...this.sizes,
      };
    },
  },
};
</script>
