<template>
  <div
    class="field"
    :class="{'is-horizontal': horizontal }"
  >
    <div
      v-if="label || $slots.label"
      class="field-label is-normal"
    >
      <label
        :for="fieldId"
        class="label"
        :class="{ required }"
      >
        <slot name="label">
          {{ label }}
        </slot>
      </label>
    </div>
    <div class="field-body">
      <div class="field">
        <div
          class="control"
          :class="{
            'has-icons-left': !!iconLeft,
            'has-icons-right': !!iconRight,
          }"
        >
          <slot />
          <span
            v-if="!!iconLeft"
            class="icon is-small is-left"
          >
            <fa-icon :icon="iconLeft" />
          </span>
          <span
            v-if="!!iconRight"
            class="icon is-small is-right"
          >
            <fa-icon :icon="iconRight" />
          </span>
        </div>
        <p
          v-if="errorMessage"
          class="help is-danger"
        >
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    iconLeft: {
      type: Array,
      default: null,
    },
    iconRight: {
      type: Array,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    fieldId: {
      type: String,
      default: null,
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~assets/css/head';
  .required:after {
    content: '*';
    color: $red;
  }
</style>
