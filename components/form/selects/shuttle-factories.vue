<template>
  <vue-multiselect
    :value="value"
    :options="list"
    track-by="id"
    label="label"
    placeholder="Sélectionner le trajet à effectuer"
    :loading="loading"
    :disabled="disabled"
    :allow-empty="false"
    deselect-label=""
    :show-labels="false"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const SHUTTLE_FACTORIES = 'shuttleFactories';

export default {
  mixins: [
    lazyDataset(SHUTTLE_FACTORIES, { mask: 'id,label,stops(id,label)' }),
  ],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
