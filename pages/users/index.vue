<template>
  <main>
    <ec-header
      title="Utilisateurs"
      :to-create-new="{name: 'users-new'}"
      @uploadCSV="uploadCSV"
    />
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
import ecHeader from '~/components/crud/header.vue';

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    ecHeader,
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
  methods: {
    async deleteUser({ id }) {
      await this.$api.users.deleteUser(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.users.getUsers('id,email', offset, limit);
      this.users = updatedList.data;
      this.pagination = updatedList.pagination;
    },
    async uploadCSV(data) {
      try {
        await this.$api.users.postUsers(data);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
    },
  },
};
</script>
