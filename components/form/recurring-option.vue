<template>
  <div class="columns">
    <ec-field
      label="Activer la récurrence"
      class="column"
      horizontal
    >
      <ec-switch
        v-model="computedValue.enabled"
      />
    </ec-field>
    <ec-field
      v-if="frequency && computedValue.enabled"
      class="column"
      label="Fréquence"
      horizontal
    >
      <ec-switch-options
        v-model="computedValue.frequency"
        :options="frequency"
      />
    </ec-field>
  </div>
</template>
<script>
import ecField from '~/components/form/field.vue';
import ecSwitch from '~/components/form/switch.vue';
import ecSwitchOptions from '~/components/form/switch-options.vue';

export default {
  components: {
    ecField,
    ecSwitch,
    ecSwitchOptions,
  },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => ({ frequency: null, enabled: false }),
    },
    frequency: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      newValue: this.value,
    };
  },
  computed: {
    computedValue: {
      get() {
        return this.newValue;
      },
      set(v) {
        this.newValue = v;
      },
    },
  },
  watch: {
    value(v) {
      this.newValue = v;
    },
    computedValue: {
      handler(val) {
        this.$emit('input', val);
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";

  .column, .columns {
    margin-bottom: 0;
  }
  .column /deep/ {
    .field-label {
      flex-basis: auto;
    }
    .field-body {
      padding-top: 0.375em;
      flex-basis: auto;
    }
  }
</style>
