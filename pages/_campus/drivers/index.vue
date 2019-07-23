<template>
  <main>
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
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="campusLink('drivers-id-edit')"
      action-remove-confirm="Voulez-vous vraiment supprimer ce chauffeur ?"
      @action-remove="deleteDriver"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';
import { mapGetters } from 'vuex';

const columns = { id: 'ID', email: 'E-mail' };

export default {
  watchQuery: ['offset'],
  components: {
    ecList,
  },
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.drivers(params.campus, Object.keys(columns).join(','))
      .getDrivers(offset, limit);
    return {
      drivers: data,
      pagination,
    };
  },
  methods: {
    async deleteDriver({ id }) {
      await this.$api.drivers(this.campus.id).deleteDriver(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.drivers(this.campus.id, Object.keys(columns).join(','))
        .getDrivers(offset, limit);
      this.drivers = updatedList.data;
      this.pagination = updatedList.pagination;
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
