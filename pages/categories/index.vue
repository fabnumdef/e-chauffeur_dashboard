<template>
  <main>
    <crud-header
      title="Catégories"
      :to-create-new="{name: 'categories-new'}"
      upload-csv
      export-csv
      :mask="mask"
      has-mask
      :pagination="pagination"
      :api-call="$api.categories(mask).getCategories"
      @uploadCSV="uploadCSV"
    />
    <crud-list
      :columns="{id: 'ID', label: 'Label'}"
      :data="categories"
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
            name: 'categories-id-edit',
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
          @click="deleteCategory(row)"
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

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.categories('id,label').getCategories({ offset, limit });
    return {
      categories: data,
      pagination,
    };
  },
  data() {
    return {
      mask: 'id,label',
    };
  },
  methods: {
    async deleteCategory({ id }) {
      if (window && window.confirm('Voulez vous vraiment supprimer cette catégorie ?')) {
        await this.$api.categories('id,label').deleteCategory(id);
        this.updateList();
      }
    },
    async uploadCSV(data) {
      try {
        await this.$api.categories().postCategories(data);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.categories('id,label').getCategories(offset, limit);
      this.categories = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>
