<template>
  <main>
    <ec-header
      title="Véhicules"
      :to-create-new="campusLink('cars-new')"
      @uploadCSV="uploadCSV"
    />
    <ec-list
      :columns="columns"
      :data="cars"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="campusLink('cars-id-edit')"
      action-remove-confirm="Voulez vous vraiment supprimer ce véhicule ?"
      @action-remove="deleteCar"
    >
      <template
        v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin() || $auth.isAdmin(campus.id)"
          :to="campusLink('cars-id-edit', {
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
          @click="deleteCar(row)"
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
import { mapGetters } from 'vuex';
import ecList from '~/components/crud/list.vue';
import ecHeader from '~/components/crud/header.vue';

const columns = { id: 'ID', label: 'Label' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    ecHeader,
  },
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api
      .cars({ id: params.campus }, Object.keys(columns).join(','))
      .getCars(offset, limit);
    return {
      cars: data,
      pagination,
    };
  },
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
    CarsAPI() {
      return this.$api.cars(this.campus, Object.keys(columns).join(','));
    },
  },
  methods: {
    async deleteCar({ id }) {
      await this.CarsAPI.deleteCar(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.CarsAPI.getCars(offset, limit);
      this.cars = updatedList.data;
      this.pagination = updatedList.pagination;
    },
    async uploadCSV(data) {
      try {
        await this.$api.CarsAPI.postCars(data);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
    },
  },
};
</script>
