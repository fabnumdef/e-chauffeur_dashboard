<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Catégories
      </h1>
      <div class="options">
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="{name: 'categories-new'}"
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
      :columns="{id: 'ID', label: 'Label'}"
      :data="categories"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template #actions="{ row }">
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
    </ec-list>
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  async asyncData({ $api }) {
    const { data, pagination } = await $api.categories('id,label').getCategories();
    return {
      categories: data,
      pagination,
    };
  },
  methods: {
    async deleteCategory({ id }) {
      if (window && window.confirm('Voulez vous vraiment supprimer cette catégorie ?')) {
        const categoryAPI = this.$api.categories('id,label');
        await categoryAPI.deleteCategory(id);
        const updatedList = await categoryAPI.getCategories();
        this.categories = updatedList.data;
        this.pagination = updatedList.pagination;
      }
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
