<template>
  <vue-multiselect
    v-bind="$attrs"
    :options="list"
    multiple
    track-by="id"
    label="label"
    :show-labels="false"
    :loading="loading"
    v-on="$listeners"
    @search-change="updateList"
  />
</template>
<script>
import lazyDataset from '~/components/form/selects/mixins/lazy-dataset';

const CATEGORIES = 'categories';

export default {
  mixins: [
    lazyDataset(CATEGORIES, { mask: ['id', 'label'] }),
  ],
};
</script>
