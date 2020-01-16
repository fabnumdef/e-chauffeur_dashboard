<template>
  <main>
    <div class="columns">
      <div class="column">
        <crud-header
          title="Chauffeurs"
          :to-create-new="campusLink('drivers-new')"
          export-csv
          :mask="mask"
          has-mask
          :pagination="driversPagination"
          :api-call="$api.drivers(campus.id, mask).getDrivers"
        />
        <crud-list
          :columns="columns"
          :data="drivers"
          :pagination-offset="driversPagination.offset"
          :pagination-total="driversPagination.total"
          :pagination-per-page="driversPagination.limit"
          :action-edit="campusLink('drivers-id-edit')"
          action-remove-confirm="Voulez-vous vraiment supprimer ce chauffeur ?"
          @action-remove="deleteDriver"
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
          upload-csv
          export-csv
          :mask="mask"
          :pagination="usersPagination"
          :api-call="$api.campusUsers(campus.id, mask).getUsers"
          @uploadCSV="usersUploadCSV"
        />
        <crud-list
          :columns="columns"
          :data="users"
          :pagination-offset="usersPagination.offset"
          :pagination-total="usersPagination.total"
          :pagination-per-page="usersPagination.limit"
          :action-edit="campusLink('users-id-edit')"
          action-remove-confirm="Voulez-vous vraiment supprimer cet utilisateur ?"
          @action-remove="deleteUser"
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

const columns = { id: 'ID', email: 'E-mail' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const driversReq = $api.drivers(params.campus, Object.keys(columns).join(','))
      .getDrivers({ offset, limit });
    const usersReq = $api.campusUsers(params.campus, Object.keys(columns).join(','))
      .getUsers(offset, limit);
    const driversRes = await driversReq;
    const usersRes = await usersReq;
    return {
      drivers: driversRes.data,
      driversPagination: driversRes.pagination,
      users: usersRes.data,
      usersPagination: usersRes.pagination,
    };
  },
  data() {
    return {
      mask: 'id,email,firstname,lastname,phone',
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
      await this.$api.drivers(this.campus.id).deleteDriver(id);
      this.updateDriversList();
    },
    async deleteUser({ id }) {
      await this.$api.campusUsers(this.campus.id).deleteUser(id);
      this.updateUsersList();
    },
    async usersUploadCSV(data) {
      try {
        await this.$api.campusUsers(this.campus.id).postUsers(data);
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
      this.users = updatedList.data;
      this.usersPagination = updatedList.pagination;
    },
    async updateDriversList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.drivers(this.campus.id, Object.keys(columns).join(','))
        .getDrivers(offset, limit);
      this.drivers = updatedList.data;
      this.driversPagination = updatedList.pagination;
    },
  },
};
</script>
