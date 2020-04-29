<template>
  <vue-multiselect
    v-bind="$attrs"
    :options="list"
    track-by="id"
    label="label"
    :show-labels="false"
    :loading="loading"
    placeholder="Choisir un modèle de téléphone"
    :value="getObjectValue"
    v-on="$listeners"
  />
</template>
<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const PHONE_MODELS = 'phoneModels';

export default {
  mixins: [
    lazyDataset(PHONE_MODELS, { mask: ['id', 'label'] }),
  ],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
