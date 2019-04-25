<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Téléphones
      </h1>
      <div class="options">
        <nuxt-link
          v-if="$auth.isAdmin()"
          :to="{name: 'phones-new'}"
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
      :columns="{id: 'S/N', model: 'Modèle'}"
      :data="phones"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="'phones-id-edit'"
      action-remove-confirm="Voulez-vous vraiment supprimer ce téléphone ?"
      @action-remove="deleteUser"
    />
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
    const { data, pagination } = await $api.phones.getPhones('*');
    return {
      phones: data,
      pagination,
    };
  },
  methods: {
    async deleteUser({ id }) {
      await this.$api.phones.deletePhone(id);
      const updatedList = await this.$api.phones.getPhones('*');
      this.phones = updatedList.data;
      this.pagination = updatedList.pagination;
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
