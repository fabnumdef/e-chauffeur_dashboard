<template>
  <div
    :class="{'is-horizontal': isHorizontal}"
    class="field"
  >
    <div
      v-if="label"
      class="field-label is-normal"
    >
      <label
        :for="fieldId"
        class="label"
      >
        {{ label }}
      </label>
    </div>
    <div class="field-body">
      <div class="field">
        <p class="control">
          <slot />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isHorizontal: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: null,
    },
    fieldId: {
      type: String,
      default: null,
    },
  },
};
</script>
