<template>
  <crud-list
    :columns="{ id: 'ID', label: 'Label', capacity: 'Capacité' }"
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
            :to="{name: 'car-models-new'}"
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
          name: 'car-models-id-edit',
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

const CAR_MODELS = 'carModels';
const DEFAULT_MASK = ['id', 'label', 'capacity'];

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Modèles de véhicules'),
    searchFilterMixin(),
    updateListMixin(CAR_MODELS, { mask: DEFAULT_MASK }),
    deleteInListMixin(CAR_MODELS, { confirmation: 'Voulez vous vraiment supprimer ce modèle de véhicule ?' }),
    importCSVMixin(CAR_MODELS),
    exportCSVMixin(CAR_MODELS, { mask: DEFAULT_MASK }),
  ],
};
</script>
