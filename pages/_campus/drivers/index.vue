<template>
  <crud-list
    :columns="{ id: 'ID', email: 'E-mail' }"
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
        <div
          class="column is-narrow"
        >
          <ec-button
            v-if="$auth.isRegulator(campus.id)"
            :to="campusLink('drivers-new')"
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
        :to="campusLink('drivers-id-edit', {
          params: { id: row.id },
        })"
        is-primary
        icon-left="edit"
      >
        Modifier
      </ec-button>
      <button
        v-if="$auth.isRegulator(campus.id)"
        class="button is-danger"
        @click="deleteRow(row)"
      >
        Supprimer
      </button>
    </template>
  </crud-list>
</template>

<script>
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';
import updateListMixin from '~/helpers/mixins/crud/update-list';
import searchFilterMixin from '~/helpers/mixins/crud/search-filter';
import deleteInListMixin from '~/helpers/mixins/crud/delete-in-list';
import titleMixin from '~/helpers/mixins/page-title';

const DRIVERS = 'drivers';
const DEFAULT_MASK = ['id', 'email'];

export default {
  components: {
    crudList,
  },
  mixins: [
    titleMixin('Chauffeurs'),
    searchFilterMixin(),
    updateListMixin(DRIVERS, {
      mask: DEFAULT_MASK,
      customQuery: (q, { params }) => q.setCampus(params.campus),
    }),
    deleteInListMixin(DRIVERS, {
      confirmation: 'Voulez vous vraiment supprimer ce chauffeur ?',
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
