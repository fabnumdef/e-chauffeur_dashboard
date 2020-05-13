<template>
  <vue-multiselect
    v-bind="$attrs"
    :allow-empty="false"
    deselect-label=""
    placeholder="Sélectionner un arret"
    :options="list"
    :value="value"
    track-by="index"
    label="label"
    :loading="loading"
    v-on="$listeners"
  />
</template>

<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const SHUTTLE_FACTORIES = 'shuttleFactories';

export default {
  mixins: [lazyDataset(SHUTTLE_FACTORIES, {
    mask: 'id,stops',
    listQuery: async function listQuery(api) {
      const res = await api.query(SHUTTLE_FACTORIES)
        .setCampus(this.$route.params.campus)
        .setMask('id,stops')
        .get(this.shuttleFactoryId);

      res.data = res.data.stops.map(
        ({ id, label }, index) => ({ id, index, label: `${index + 1}: ${label}` }),
      );

      return res;
    },
  })],
  props: {
    shuttleFactoryId: {
      type: String,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
