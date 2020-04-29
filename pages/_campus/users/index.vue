<template>
  <div class="columns">
    <crud-list
      class="column"
      :columns="{ id: 'ID', email: 'E-mail' }"
      :data="dataDrivers"
      :pagination="driversPagination"
    >
      <template #intro>
        <h1 class="title">
          Chauffeurs
        </h1>
        <div class="columns">
          <div class="column">
            <search-filter
              :value="searchDriversTerms"
              @update="searchDrivers"
            />
          </div>
          <export-button
            :pagination="driversPagination"
            :export-query="exportDriversQuery"
            class="column is-narrow"
          />
          <div
            class="column is-narrow"
          >
            <ec-button
              v-if="$auth.isAdmin(campus.id)"
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
        v-if="$auth.isAdmin(campus.id)"
        #actions="{ row }"
      >
        <ec-button
          v-if="$auth.isAdmin(campus.id)"
          :to="campusLink('users-id-edit', {
            params: { id: row.id },
          })"
          is-primary
          icon-left="edit"
          class="button is-primary"
        >
          Modifier
        </ec-button>
        <ec-button
          v-if="$auth.isAdmin(campus.id)"
          is-danger
          icon-left="trash"
          @click="deleteDriver(row)"
        >
          Supprimer
        </ec-button>
      </template>
    </crud-list>
    <crud-list
      class="column"
      :columns="{ id: 'ID', email: 'E-mail' }"
      :data="dataUsers"
      :pagination="usersPagination"
    >
      <template #intro>
        <h1 class="title">
          Utilisateurs
        </h1>
        <div class="columns">
          <div class="column">
            <search-filter
              :value="searchUsersTerms"
              @update="searchUsers"
            />
          </div>
          <export-button
            :pagination="usersPagination"
            :export-query="exportUsersQuery"
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
          v-if="$auth.isAdmin(campus.id)"
          :to="campusLink('users-id-edit', {
            params: { id: row.id },
          })"
          is-primary
          icon-left="edit"
        >
          Modifier
        </ec-button>
        <ec-button
          v-if="$auth.isSuperAdmin()"
          is-danger
          icon-left="trash"
          @click="deleteUser(row)"
        >
          Supprimer
        </ec-button>
      </template>
    </crud-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';
import updateListMixin from '~/helpers/mixins/crud/update-list';
import searchFilterMixin from '~/helpers/mixins/crud/search-filter';
import deleteInListMixin from '~/helpers/mixins/crud/delete-in-list';
import exportCSVMixin from '~/helpers/mixins/crud/export-csv';

const DRIVERS = 'drivers';
const USERS = 'users';
const DEFAULT_MASK = 'id,email,firstname,lastname,phone(original,canonical)';

const customQuery = (q, { params }) => q.setCampus(params.campus);
const UPDATE_USERS_METHOD = 'updateUsersList';
const UPDATE_DRIVERS_METHOD = 'updateDriversList';
const updateDriversMixin = updateListMixin(DRIVERS, {
  mask: DEFAULT_MASK,
  dataKey: 'dataDrivers',
  paginationKey: 'driversPagination',
  updateKey: UPDATE_DRIVERS_METHOD,
  customQuery,
  querySearch: 'searchDrivers',
});

const updateUsersMixin = updateListMixin(USERS, {
  mask: DEFAULT_MASK,
  dataKey: 'dataUsers',
  paginationKey: 'usersPagination',
  updateKey: UPDATE_USERS_METHOD,
  customQuery,
  querySearch: 'searchUsers',
});

export default {
  components: {
    crudList,
  },
  mixins: [
    // @todo: Add custom key for offset query
    searchFilterMixin({ methodName: 'searchUsers', querySearch: 'searchUsers' }),
    searchFilterMixin({ methodName: 'searchDrivers', querySearch: 'searchDrivers' }),
    updateDriversMixin,
    updateUsersMixin,
    deleteInListMixin(DRIVERS, {
      confirmation: 'Voulez vous vraiment supprimer ce chauffeur ?',
      deleteMethod: 'deleteDriver',
      updateMethod: UPDATE_DRIVERS_METHOD,
      customQuery,
    }),
    deleteInListMixin(USERS, {
      confirmation: 'Voulez vous vraiment supprimer cet utilisateur ?',
      deleteMethod: 'deleteUser',
      updateMethod: UPDATE_USERS_METHOD,
      customQuery,
    }),
    exportCSVMixin(DRIVERS, {
      mask: DEFAULT_MASK,
      exportMethod: 'exportDriversQuery',
      customQuery,
    }),
    exportCSVMixin(USERS, { mask: DEFAULT_MASK, exportMethod: 'exportUsersQuery' }),

  ],
  async asyncData(...params) {
    return {
      ...(await updateDriversMixin.asyncData(...params)),
      ...(await updateUsersMixin.asyncData(...params)),
    };
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
};
</script>
