<template>
  <vue-multiselect
    :id="id"
    :options="roles"
    :value="value"
    :show-labels="false"
    :placeholder="placeholder"
    @input="onInput"
  />
</template>
<script>
import * as roles from '@fabnumdef/e-chauffeur_lib-vue/api/roles';

export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      roles: Object.keys(roles),
    };
  },
  methods: {
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
