<template>
  <main>
    <div class="columns">
      <div class="column">
        <crud-header
          title="Chauffeurs"
          :to-create-new="campusLink('drivers-new')"
          :can-create-new="$auth.isAdmin(campus.id)"
          export-csv
          :mask="mask"
          has-mask
          :pagination="driversPagination"
          :api-call="$api.drivers(campus.id, mask).getDrivers"
        />
        <crud-filter
          :field-value="driversFilter.fieldFilter"
          :content-value="driversFilter.contentFilter"
          :fields-header="[
            { id: 'id', label: 'Id' },
            { id: 'email', label: 'E-mail' }
          ]"
          :field-content="fieldContentDriver"
          @updateFieldFilter="updateFieldFilterDriver"
          @updateContentFilter="updateContentFilterDriver"
          @reset="resetDrivers"
        />
        <crud-list
          :columns="columns"
          :data="filteredDataDriver"
          :pagination-offset="driversPagination.offset"
          :pagination-total="driversPagination.total"
          :pagination-per-page="driversPagination.limit"
          :action-edit="campusLink('drivers-id-edit')"
        >
          <template
            v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
            #actions="{ row }"
          >
            <nuxt-link
              v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
              :to="campusLink('users-id-edit', {
                params: { id: row.id },
              })"
              class="button is-primary"
            >
              <span class="icon is-small">
                <fa-icon :icon="['fas', 'edit']" />
              </span>
              <span>Modifier</span>
            </nuxt-link>
            <button
              v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
              class="button is-danger"
              @click="deleteDriver(row)"
            >
              <span class="icon is-small">
                <fa-icon :icon="['fas', 'trash']" />
              </span>
              <span>Supprimer</span>
            </button>
          </template>
        </crud-list>
      </div>
      <div class="column">
        <crud-header
          title="Utilisateurs"
          :to-create-new="campusLink('users-new')"
          :can-create-new="$auth.isAdmin(campus.id)"
          export-csv
          :mask="mask"
          has-mask
          :pagination="usersPagination"
          :api-call="$api.campusUsers(campus.id, mask).getUsers"
          @importCSV="usersUploadCSV"
        />
        <crud-filter
          :field-value="usersFilter.fieldFilter"
          :content-value="usersFilter.contentFilter"
          :fields-header="[
            { id: 'id', label: 'Id' },
            { id: 'email', label: 'E-mail' }
          ]"
          :field-content="fieldContentUser"
          @updateFieldFilter="updateFieldFilterUser"
          @updateContentFilter="updateContentFilterUser"
          @reset="resetUsers"
        />
        <crud-list
          :columns="columns"
          :data="filteredDataUser"
          :pagination-offset="usersPagination.offset"
          :pagination-total="usersPagination.total"
          :pagination-per-page="usersPagination.limit"
          :action-edit="campusLink('users-id-edit')"
        >
          <template
            v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
            #actions="{ row }"
          >
            <nuxt-link
              v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
              :to="campusLink('users-id-edit', {
                params: { id: row.id },
              })"
              class="button is-primary"
            >
              <span class="icon is-small">
                <fa-icon :icon="['fas', 'edit']" />
              </span>
              <span>Modifier</span>
            </nuxt-link>
            <button
              v-if="$auth.isSuperAdmin()"
              class="button is-danger"
              @click="deleteUser(row)"
            >
              <span class="icon is-small">
                <fa-icon :icon="['fas', 'trash']" />
              </span>
              <span>Supprimer</span>
            </button>
          </template>
        </crud-list>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';
import crudFilter from '~/components/crud/filter.vue';
import handleFilters from '~/components/crud/mixins/handle-filters-campus-users';

const columns = { id: 'ID', email: 'E-mail' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
    crudFilter,
  },
  mixins: [handleFilters],
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const driversReq = $api.drivers(params.campus, Object.keys(columns).join(','))
      .getDrivers({ offset, limit });
    const usersReq = $api.campusUsers(params.campus, Object.keys(columns).join(','))
      .getUsers({ offset, limit });
    const driversRes = await driversReq;
    const usersRes = await usersReq;
    return {
      driversData: driversRes.data,
      driversPagination: driversRes.pagination,
      usersData: usersRes.data,
      usersPagination: usersRes.pagination,
    };
  },
  data() {
    return {
      mask: 'email,firstname,lastname,phone(original,canonical)',
    };
  },
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async deleteDriver({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer ce chauffeur ?')) {
        await this.$api.drivers(this.campus.id).deleteDriver(id);
        this.updateDriversList();
      }
    },
    async deleteUser({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer cet utilisateur ?')) {
        await this.$api.campusUsers(this.campus.id).deleteUser(id);
        this.updateUsersList();
      }
    },
    async usersUploadCSV({ data, params }) {
      try {
        await this.$api.campusUsers(this.campus.id).postUsers(data, params);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateDriversList();
      this.updateUsersList();
    },
    async updateUsersList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.campusUsers(this.campus.id, Object.keys(columns).join(','))
        .getUsers(offset, limit);
      this.usersData = updatedList.data;
      this.usersPagination = updatedList.pagination;
    },
    async updateDriversList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.drivers(this.campus.id, Object.keys(columns).join(','))
        .getDrivers(offset, limit);
      this.driversData = updatedList.data;
      this.driversPagination = updatedList.pagination;
    },
  },
};
</script>
