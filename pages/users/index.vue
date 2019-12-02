<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Utilisateurs
      </h1>
      <button
        class="button is-rounded"
        type="button"
        @click="toggleCsvModal(true)"
      >
        <fa-icon
          :icon="['fas', 'file-export']"
          class="has-text-info"
        />
        Exporter CSV
      </button>
      <csv-modal
        :csvStatus="displayModal"
        @toggleModal="toggleCsvModal"
        :pagination="pagination"
        :apiCall="$api.users.getUsers"
        :mask="mask"
      />
      <div class="options">
        <nuxt-link
          v-if="$auth.isRegulator()"
          :to="{name: 'users-new'}"
          class="button is-success"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Créer</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="{id: 'ID', email: 'E-mail'}"
      :data="users"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template #actions="{ row }">
        <nuxt-link
          v-if="$auth.isRegulator()"
          :to="{
            name: 'users-id-edit',
            params: { id: row.id },
          }"
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
    </ec-list>
  </main>
</template>

<script>
import ecList from '~/components/crud/list';
import csvModal from '~/components/csv-modal';

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    csvModal,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.users.getUsers('id,email', { offset, limit });
    return {
      users: data,
      pagination,
    };
  },
  data() {
    return {
      displayModal: false,
      mask: 'id,email,firstname,lastname,phone',
    };
  },
  methods: {
    async deleteUser({ id }) {
      await this.$api.users.deleteUser(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.users.getUsers('id,email', { offset, limit });
      this.users = updatedList.data;
      this.pagination = updatedList.pagination;
    },
    toggleCsvModal(force) {
      this.displayModal = force || !this.displayModal;
    },
  },
};
</script>

<style lang="scss" scoped>
  .with-options {
    display: flex;
    .title {
      flex-grow: 1;
    }
    .options {
      padding: 0 10px 10px;
      float: right;
    }
  }
</style>
