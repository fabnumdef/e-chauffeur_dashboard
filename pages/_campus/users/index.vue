<template>
  <main>
    <div class="columns">
      <div class="column">
        <header>
          <div class="columns">
            <div class="column">
              <h1 class="title">
                Chauffeurs
              </h1>
            </div>
            <div class="column is-narrow">
              <nuxt-link
                :to="campusLink('drivers-new')"
                class="button is-success"
              >
                <span class="icon is-small">
                  <fa-icon :icon="['fas', 'plus']" />
                </span>
                <span>Nouveau</span>
              </nuxt-link>
            </div>
          </div>
        </header>
        <ec-list
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
        </ec-list>
      </div>
      <div class="column">
        <header>
          <div class="columns">
            <div class="column">
              <h1 class="title">
                Utilisateurs
              </h1>
            </div>
            <div class="column is-narrow">
              <nuxt-link
                :to="campusLink('users-new')"
                class="button is-success"
              >
                <span class="icon is-small">
                  <fa-icon :icon="['fas', 'plus']" />
                </span>
                <span>Nouveau</span>
              </nuxt-link>
            </div>
          </div>
        </header>
        <ec-list
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
        </ec-list>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ecList from '~/components/crud/list.vue';

const columns = { id: 'ID', email: 'E-mail' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const driversReq = $api.drivers(params.campus, Object.keys(columns).join(','))
      .getDrivers(offset, limit);
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
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async deleteDriver({ id }) {
      await this.$api.drivers(this.campus.id).deleteDriver(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.drivers(this.campus.id, Object.keys(columns).join(','))
        .getDrivers(offset, limit);
      this.drivers = updatedList.data;
      this.driversPagination = updatedList.pagination;
    },
    async deleteUser({ id }) {
      await this.$api.campusUsers(this.campus.id).deleteUser(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.campusUsers(this.campus.id, Object.keys(columns).join(','))
        .getUsers(offset, limit);
      this.users = updatedList.data;
      this.usersPagination = updatedList.pagination;
    },
  },
};
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 1.5rem;
    .button {
      margin-right: 10px;
    }
  }
</style>
