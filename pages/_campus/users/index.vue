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
              <button
                class="button is-rounded"
                type="button"
                @click="toggleCsvModal(true, 'drivers')"
              >
                <fa-icon
                  :icon="['fas', 'file-export']"
                  class="has-text-info"
                />
                Exporter CSV
              </button>
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
        />
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
              <button
                class="button is-rounded"
                type="button"
                @click="toggleCsvModal(true, 'users')"
              >
                <fa-icon
                  :icon="['fas', 'file-export']"
                  class="has-text-info"
                />
                Exporter CSV
              </button>
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
        />
      </div>
    </div>
    <csv-modal
      :csv-status="displayModal"
      :pagination="modalType === 'users' ? usersPagination : driversPagination"
      :api-call="modalType === 'users'
        ? $api.campusUsers(campus.id, mask).getUsers
        : $api.drivers(campus.id, mask).getDrivers"
      :has-mask="true"
      :mask="mask"
      @toggleModal="toggleCsvModal"
      @updateMask="updateMask"
    />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ecList from '~/components/crud/list.vue';
import csvModal from '~/components/csv-modal';

const columns = { id: 'ID', email: 'E-mail' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    csvModal,
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
      displayModal: false,
      modalType: '',
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
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.drivers(this.campus.id, Object.keys(columns).join(','))
        .getDrivers({ offset, limit });
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
    toggleCsvModal(force, type) {
      this.modalType = type;
      this.displayModal = force || !this.displayModal;
    },
    updateMask(mask) {
      this.mask = mask;
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
