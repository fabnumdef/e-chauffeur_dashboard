<template>
  <crud-list
    :columns="{
      createdAt: 'Date',
      uxGrade: 'Note UX',
      recommandationGrade: 'Recommandation'
    }"
    :data="data"
    :pagination="pagination"
  >
    <template #intro>
      <div class="columns">
        <div class="column" />
        <export-button
          v-if="$auth.isSuperAdmin()"
          :pagination="pagination"
          :export-query="exportQuery"
          class="column is-narrow"
        />
      </div>
    </template>
    <template
      v-if="$auth.isSuperAdmin()"
      #actions="{ row }"
    >
      <ec-button
        :to="campusLink('ratings-id', {
          params: { id: row.id },
        })"
        class="button is-primary fill-height"
      >
        Détails
      </ec-button>
    </template>
  </crud-list>
</template>

<script>
import { DateTime } from 'luxon';

import crudList from '~/components/crud/list.vue';
import updateListMixin from '~/helpers/mixins/crud/update-list';
import exportCSVMixin from '~/helpers/mixins/crud/export-csv';
import titleMixin from '~/helpers/mixins/page-title';

const RATINGS = 'ratings';
const DEFAULT_MASK = ['id', 'createdAt', 'uxGrade', 'recommandationGrade'];

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Appréciations'),
    updateListMixin(RATINGS, {
      mask: DEFAULT_MASK,
      customQuery: (q, { params }) => q.setCampus(params.campus),
      customList: async (l) => {
        const list = await l;
        list.data = list.data.map((rating) => ({
          ...rating,
          createdAt: DateTime.fromISO(rating.createdAt).toLocaleString(DateTime.DATETIME_SHORT),
        }));
        return list;
      },
    }),
    exportCSVMixin(RATINGS, {
      mask: DEFAULT_MASK,
      customQuery: (q, { params }) => q.setCampus(params.campus),
    }),
  ],
};
</script>
