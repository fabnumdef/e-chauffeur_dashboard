<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Utilisateurs
      </h1>
      <div class="options">
        <button
          class="button is-rounded"
          type="button"
          @click="toggleUploadModal"
        >
          <fa-icon
            :icon="['fas', 'file-import']"
            class="has-text-info"
          />
          Importer CSV
        </button>
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
      <upload-modal
        :display="displayUploadModal"
        @toggle="toggleUploadModal"
        @submit="uploadCSV"
      />
    </header>
    <ec-list
      :columns="{id: 'ID', email: 'E-mail'}"
      :data="users"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template
        v-if="$auth.isSuperAdmin()"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
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
import ecList from '~/components/crud/list.vue';
import uploadModal from '~/components/modals/upload.vue';

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    uploadModal,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.users.getUsers('id,email', offset, limit);
    return {
      users: data,
      pagination,
    };
  },
  data() {
    return {
      displayUploadModal: false,
    };
  },
  methods: {
    async deleteUser({ id }) {
      await this.$api.users.deleteUser(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.users.getUsers('id,email', offset, limit);
      this.users = updatedList.data;
      this.pagination = updatedList.pagination;
    },
    toggleUploadModal() {
      this.displayUploadModal = !this.displayUploadModal;
    },
    uploadCSV(evt) {
      console.log('submit', evt);
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
      * {
        margin: 0 .3em;
      }
    }
  }
</style>
