<template>
  <vue-multiselect
    v-bind="$attrs"
    :options="list"
    track-by="id"
    label="name"
    :show-labels="false"
    :loading="loading"
    :searchable="false"
    placeholder="Choisir une base"
    v-on="$listeners"
  />
</template>

<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const JWT = 'jwt';
const mask = 'id,name,location';

export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  mixins: [
    lazyDataset(JWT, {
      mask,
      listQuery: (api) => api.query(JWT)
        .setMask(mask)
        .accessibleCampuses(),
    }),
  ],
};
</script>
