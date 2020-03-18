<template>
  <main>
    <crud-header
      title="Appréciations"
      export-csv
      :mask="mask"
      :pagination="pagination"
      :api-call="$api.users.getUsers"
    />
    <crud-list
      :columns="columns"
      :data="ratings"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="campusLink('ratings-id', {
            params: { id: row.id },
          })"
          class="button is-primary fill-height"
        >
          <span>Détails</span>
        </nuxt-link>
      </template>
    </crud-list>
  </main>
</template>

<script>
import { DateTime } from 'luxon';
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';

const columns = {
  createdAt: 'Date',
  uxGrade: 'Note UX',
  recommandationGrade: 'Recommandation',
};

const mask = Object.keys(columns).concat('id').join(',');

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ $api, query, params }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.ratings(params.campus, mask).getRatings({ offset, limit });
    const ratings = data.map((rating) => ({
      ...rating,
      createdAt: DateTime.fromISO(rating.createdAt).toLocaleString('dd LLL yyyy', { locale: 'fr' }),
    }));
    return {
      ratings,
      pagination,
    };
  },
  computed: {
    columns() { return columns; },
  },
};
</script>
