<template>
  <crud-list
    :columns="{ id: 'ID', label: 'Label', enabled: 'Activé' }"
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
            :to="campusLink('pois-new')"
            is-success
            icon-left="plus"
          >
            Créer
          </ec-button>
        </div>
      </div>
    </template>
    <template
      v-if="$auth.isAdmin(campus.id)"
      #actions="{ row }"
    >
      <ec-button
        :to="campusLink('pois-id-edit', {
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

const POIS = 'pois';
const DEFAULT_MASK = ['id', 'label', 'enabled'];

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Lieux'),
    searchFilterMixin(),
    updateListMixin(POIS, {
      mask: DEFAULT_MASK,
      customList: async (l, { params }) => {
        const list = await l.setFilter('withDisabled', true).setFilter('campus', params.campus);
        list.data = list.data.map((poi) => ({
          ...poi,
          enabled: (poi.enabled === false)
            ? 'fas:times-circle:error'
            : 'fas:check-circle:success',
        }));
        return list;
      },
    }),
    deleteInListMixin(POIS, { confirmation: 'Voulez vous vraiment supprimer ce lieu ?' }),
    importCSVMixin(POIS),
    exportCSVMixin(POIS, { mask: [...DEFAULT_MASK, 'location(coordinates)'] }),
  ],
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
};
</script>
