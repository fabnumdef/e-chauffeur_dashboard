<template>
  <div class="columns">
    <vue-multiselect
      v-bind="$attrs"
      :options="list"
      track-by="id"
      label="name"
      :show-labels="false"
      :loading="loading"
      :searchable="false"
      placeholder="Choisir une base"
      :value="getObjectValue"
      v-on="$listeners"
    />
    <ec-button
      title="Recharger la liste"
      class="is-narrow"
      icon-left="redo"
      @click="updateList()"
    />
  </div>
</template>

<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const JWT = 'jwt';
const mask = 'id,name,location';

export default {
  mixins: [
    lazyDataset(JWT, {
      mask,
      listQuery: (api) => api.query(JWT)
        .setMask(mask)
        .accessibleCampuses(),
    }),
  ],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "~assets/css/head";
  button {
    background: transparent;
    color: $white;
    border: 0;
  }
</style>
