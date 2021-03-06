<template>
  <crud-list
    :columns="{id: 'S/N', assignTo: 'Assigné à'}"
    :data="data"
    :pagination="pagination"
  >
    <template #intro>
      <div class="columns">
        <div class="column">
          <search-filter
            :value="searchTerms"
            @update="search"
          />
        </div>
        <export-button
          :pagination="pagination"
          :export-query="exportQuery"
          class="column is-narrow"
        />
        <import-button
          v-if="$auth.isAdmin(campus.id)"
          class="column is-narrow"
          @import="importCSV"
        />
        <div
          class="column is-narrow"
        >
          <ec-button
            v-if="$auth.isAdmin(campus.id)"
            :to="campusLink('phones-new')"
            is-success
            icon-left="plus"
          >
            Créer
          </ec-button>
        </div>
      </div>
    </template>
    <template
      v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
      #actions="{ row }"
    >
      <ec-button
        :to="campusLink('phones-id-edit', {
          params: { id: row.id },
        })"
        is-primary
        icon-left="edit"
      >
        Modifier
      </ec-button>
      <ec-button
        is-danger
        icon-left="trash"
        @click="deleteRow(row)"
      >
        Supprimer
      </ec-button>
    </template>
  </crud-list>
</template>

<script>
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';
import updateListMixin from '~/helpers/mixins/crud/update-list';
import searchFilterMixin from '~/helpers/mixins/crud/search-filter';
import deleteInListMixin from '~/helpers/mixins/crud/delete-in-list';
import importCSVMixin from '~/helpers/mixins/crud/import-csv';
import exportCSVMixin from '~/helpers/mixins/crud/export-csv';
import titleMixin from '~/helpers/mixins/page-title';

const PHONES = 'phones';
const DEFAULT_MASK = 'id,imei,model(id,label),number,campus(id),state,comments';

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Téléphones'),
    searchFilterMixin(),
    updateListMixin(PHONES, {
      mask: DEFAULT_MASK,
      customQuery: (q, { params }) => q.setCampus(params.campus),
    }),
    deleteInListMixin(PHONES, {
      confirmation: 'Voulez vous vraiment supprimer ce téléphone ?',
      customQuery: (q, { params }) => q.setCampus(params.campus),
    }),
    importCSVMixin(PHONES),
    exportCSVMixin(PHONES, {
      mask: DEFAULT_MASK,
      customQuery: (q, { params }) => q.setCampus(params.campus),
    }),
  ],
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
};
</script>
