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
          class="column is-narrow"
          @import="importCSV"
        />
        <div
          class="column is-narrow"
        >
          <ec-button
            :to="{name: 'pois-new'}"
            is-success
            icon-left="plus"
          >
            Créer
          </ec-button>
        </div>
      </div>
    </template>
    <template
      v-if="$auth.isSuperAdmin()"
      #actions="{ row }"
    >
      <ec-button
        v-if="$auth.isSuperAdmin()"
        :to="{
          name: 'pois-id-edit',
          params: row,
        }"
        is-primary
        icon-left="edit"
      >
        Modifier
      </ec-button>
      <ec-button
        v-if="$auth.isSuperAdmin()"
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
import crudList from '~/components/crud/list.vue';
import titleMixin from '~/helpers/mixins/page-title';
import searchFilterMixin from '~/helpers/mixins/crud/search-filter';
import updateListMixin from '~/helpers/mixins/crud/update-list';
import deleteInListMixin from '~/helpers/mixins/crud/delete-in-list';
import exportCSVMixin from '~/helpers/mixins/crud/export-csv';
import importCSVMixin from '~/helpers/mixins/crud/import-csv';

const POIS = 'pois';
const DEFAULT_MASK = ['id', 'label', 'location(coordinates)', 'campus(id,name)'];

export default {
  components: {
    crudList,
  },

  mixins: [
    titleMixin('Lieux'),
    searchFilterMixin(),
    updateListMixin(POIS, {
      mask: DEFAULT_MASK,
      customList: async (v) => {
        const results = await v.setFilter('withDisabled', true);
        results.data = results.data.map((poi) => ({
          ...poi,
          enabled: (poi.enabled === false)
            ? 'fas:times-circle:error'
            : 'fas:check-circle:success',
        }));
        return results;
      },
    }),
    deleteInListMixin(POIS, { confirmation: 'Voulez vous vraiment supprimer ce lieu ?' }),
    exportCSVMixin(POIS, { mask: DEFAULT_MASK }),
    importCSVMixin(POIS),
  ],
};
</script>
