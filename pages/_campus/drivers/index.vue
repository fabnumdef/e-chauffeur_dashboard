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
      :pagination-offset="0"
      :pagination-total="drivers.length"
      :pagination-per-page="0"
      :action-edit="campusLink('drivers-id-edit')"
      action-remove-confirm="Voulez-vous vraiment supprimer ce chauffeur ?"
      @action-remove="deleteDriver"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';
import { mapGetters } from 'vuex';

const columns = { id: 'ID', name: 'Nom', email: 'E-mail' };

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
  async asyncData({ params, $api }) {
    const { data } = await $api.drivers(params.campus, Object.keys(columns).join(',')).getDrivers();
    return {
      drivers: data,
      // pagination, // TODO find a solution for pagination
    };
  },
  methods: {
    async deleteDriver({ id }) {
      // TODO driver delete function
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
