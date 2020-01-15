<template>
  <main>
    <crud-header
      title="Modèles de véhicules"
      :to-create-new="{name: 'car-models-new'}"
      @uploadCSV="uploadCSV"
    />
    <crud-list
      :columns="columns"
      :data="carModels"
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
            name: 'car-models-id-edit',
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
          @click="deleteCarModel(row)"
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

const columns = { id: 'ID', label: 'Label' };

function getCarModels(offset, limit) {
  return this.carModels.getCarModels(Object.keys(columns).join(','), {}, offset, limit);
}

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await getCarModels.call($api, offset, limit);
    return {
      carModels: data,
      pagination,
    };
  },
  computed: {
    columns() { return columns; },
  },
  methods: {
    async deleteCarModel({ id }) {
      await this.$api.carModels.deleteCarModel(id);
      this.updateList();
    },
    async uploadCSV(data) {
      try {
        await this.$api.carModels.postCarModels(data);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await getCarModels.call(this.$api, offset, limit);
      this.carModels = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>
