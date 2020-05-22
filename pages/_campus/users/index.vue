<template>
  <crud-list
    class="column"
    :columns="{ id: 'ID', email: 'E-mail' }"
    :data="data"
    :pagination="pagination"
  >
    <template #intro>
      <h1 class="title">
        Utilisateurs
      </h1>
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
            v-if="$auth.isAdmin(campus.id)"
            :to="campusLink('users-new')"
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
        :to="campusLink('users-id-edit', {
          params: row,
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
import exportCSVMixin from '~/helpers/mixins/crud/export-csv';

const USERS = 'users';
const DEFAULT_MASK = 'id,email,firstname,lastname,phone(original,canonical)';
const customQuery = (q, { params }) => q.setCampus(params.campus);

export default {
  components: {
    crudList,
  },
  mixins: [
    searchFilterMixin(),
    updateListMixin(USERS, {
      mask: DEFAULT_MASK,
      customQuery,
    }),
    deleteInListMixin(USERS, {
      confirmation: 'Voulez vous vraiment supprimer cet utilisateur ?',
      customQuery,
    }),
    exportCSVMixin(USERS, {
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
