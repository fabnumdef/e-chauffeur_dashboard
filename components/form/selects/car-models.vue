<template>
  <vue-multiselect
    v-bind="$attrs"
    :options="list"
    track-by="id"
    label="label"
    :show-labels="false"
    :loading="loading"
    placeholder="Choisir un modèle de véhicule"
    :value="getObjectValue"
    v-on="$listeners"
  />
</template>
<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const CAR_MODELS = 'carModels';

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [
    lazyDataset(CAR_MODELS, { mask: ['id', 'label'] }),
  ],
};
</script>
