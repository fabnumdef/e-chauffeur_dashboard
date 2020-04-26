<template>
  <crud-list
    :columns="{ id: 'ID', label: 'Label' }"
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
          v-if="$auth.isRegulator(campus.id)"
          class="column is-narrow"
          @import="importCSV"
        />
        <div
          class="column is-narrow"
        >
          <ec-button
            v-if="$auth.isRegulator(campus.id)"
            :to="campusLink('cars-new')"
            is-success
            icon-left="plus"
          >
            Créer
          </ec-button>
        </div>
      </div>
    </template>
    <template
      v-if="$auth.isRegulator(campus.id)"
      #actions="{ row }"
    >
      <ec-button
        v-if="$auth.isRegulator(campus.id)"
        :to="campusLink('cars-id-edit', {
          params: { id: row.id },
        })"
        is-primary
        icon-left="edit"
      >
        Modifier
      </ec-button>
      <ec-button
        v-if="$auth.isRegulator(campus.id)"
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


const CARS = 'cars';
const DEFAULT_MASK = 'id,label,model(id,label),campus(id,name)';

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Véhicules'),
    searchFilterMixin(),
    updateListMixin(CARS, {
      mask: DEFAULT_MASK,
      customList: async (l, { params }) => l.setFilter('campus', params.campus),
    }),
    deleteInListMixin(CARS, { confirmation: 'Voulez vous vraiment supprimer ce véhicule ?' }),
    importCSVMixin(CARS),
    exportCSVMixin(CARS, { mask: DEFAULT_MASK }),
  ],
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
};
</script>
