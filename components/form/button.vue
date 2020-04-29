<template>
  <component
    :is="kindOfComponent"
    v-bind="$attrs"
    :to="to"
    class="button"
    :class="classes"
    :disabled="loading"
    v-on="$listeners"
  >
    <span
      v-if="iconLeft"
      class="icon is-small"
      :class="iconClass"
    >
      <fa-icon :icon="iconLeft" />
    </span>
    <span>
      <slot />
    </span>
    <span
      v-if="iconRight"
      class="icon is-small"
    >
      <fa-icon :icon="iconRight" />
    </span>
  </component>
</template>
<script>
import genericModifiers, {
  COLORS, GRAYSCALE, STATES, TEXT,
} from '~/helpers/mixins/ui/generic-modifiers';
import sizeModifiers from '~/helpers/mixins/ui/size-modifiers';

export const FULLWIDTH = 'fullwidth';
export const OUTLINED = 'outlined';
export const INVERTED = 'inverted';
export const ROUNDED = 'rounded';
export const MODIFIERS = [...COLORS, ...GRAYSCALE, ...STATES, TEXT, FULLWIDTH, OUTLINED, INVERTED];

export default {
  mixins: [
    genericModifiers('modifiers', ...MODIFIERS, FULLWIDTH, OUTLINED, INVERTED, ROUNDED),
    sizeModifiers('sizes'),
  ],
  props: {
    to: {
      type: [Object, String],
      default: null,
    },
    iconRight: {
      type: [Array, String],
      default: null,
    },
    iconLeft: {
      type: [Array, String],
      default: null,
    },
    iconClass: {
      type: [String, Object],
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
    kindOfComponent() {
      return this.to ? 'nuxt-link' : 'button';
    },
  },
};
</script>
