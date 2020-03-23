<template>
  <main>
    <crud-header
      title="Utilisateurs"
      :to-create-new="{name: 'users-new'}"
      import-csv
      export-csv
      :mask="mask"
      :pagination="pagination"
      :api-call="$api.users.getUsers"
      @importCSV="importCSV"
    />
    <crud-filter
      :field-value="fieldFilter"
      :content-value="contentFilter"
      :fields-header="[
        { id: 'id', label: 'Id' },
        { id: 'email', label: 'E-mail' }
      ]"
      :field-content="fieldContent"
      @updateFieldFilter="updateFieldFilter"
      @updateContentFilter="updateContentFilter"
      @reset="reset"
    />
    <crud-list
      :columns="{id: 'ID', email: 'E-mail'}"
      :data="filteredData"
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
    </crud-list>
  </main>
</template>

<script>
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';
import crudFilter from '~/components/crud/filter.vue';
import handleFilter from '~/components/crud/mixins/handle-filters';

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
    crudFilter,
  },
  mixins: [handleFilter],
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.users.getUsers('id,email', { offset, limit });
    return {
      data,
      pagination,
    };
  },
  data() {
    return {
      mask: 'email,firstname,lastname,phone(original,canonical)',
    };
  },
  methods: {
    async deleteUser({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer cet utilisateur ?')) {
        await this.$api.users.deleteUser(id);
        this.updateList();
      }
    },
    async importCSV({ data, params }) {
      try {
        await this.$api.users.postUsers(data, params);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.users.getUsers('id,email', { offset, limit });
      this.data = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>
