<template>
  <crud-list
    :columns="{id: 'ID', label: 'Label'}"
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
            :to="{name: 'categories-new'}"
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
          name: 'categories-id-edit',
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
import updateListMixin from '~/helpers/mixins/crud/update-list';
import searchFilterMixin from '~/helpers/mixins/crud/search-filter';
import deleteInListMixin from '~/helpers/mixins/crud/delete-in-list';
import importCSVMixin from '~/helpers/mixins/crud/import-csv';
import exportCSVMixin from '~/helpers/mixins/crud/export-csv';
import titleMixin from '~/helpers/mixins/page-title';

const CATEGORIES = 'categories';
const DEFAULT_MASK = ['id', 'label'];

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Catégories'),
    searchFilterMixin(),
    updateListMixin(CATEGORIES, { mask: DEFAULT_MASK }),
    deleteInListMixin(CATEGORIES, { confirmation: 'Voulez vous vraiment supprimer cette catégorie ?' }),
    importCSVMixin(CATEGORIES),
    exportCSVMixin(CATEGORIES, { mask: DEFAULT_MASK }),
  ],
};
</script>
