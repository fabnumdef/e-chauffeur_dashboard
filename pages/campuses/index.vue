<template>
  <crud-list
    :columns="{id: 'ID', name: 'Nom'}"
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
        <div
          class="column is-narrow"
        >
          <ec-button
            :to="{name: 'campuses-new'}"
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
        :to="{
          name: 'campuses-id-edit',
          params: row,
        }"
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
import crudList from '~/components/crud/list.vue';
import titleMixin from '~/helpers/mixins/page-title';
import searchFilterMixin from '~/helpers/mixins/crud/search-filter';
import updateListMixin from '~/helpers/mixins/crud/update-list';
import deleteInListMixin from '~/helpers/mixins/crud/delete-in-list';
import exportCSVMixin from '~/helpers/mixins/crud/export-csv';

const CAMPUSES = 'campuses';
const DEFAULT_MASK = ['id', 'name'];

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Bases'),
    searchFilterMixin(),
    updateListMixin(CAMPUSES, { mask: DEFAULT_MASK }),
    deleteInListMixin(CAMPUSES, { confirmation: 'Voulez vous vraiment supprimer cette base ?' }),
    exportCSVMixin(CAMPUSES, { mask: DEFAULT_MASK }),
  ],
};
</script>
