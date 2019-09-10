<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Modèles de téléphones
      </h1>
      <div class="options">
        <nuxt-link
          v-if="$auth.isAdmin()"
          :to="{name: 'phone-models-new'}"
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
      :columns="{id: 'ID', label: 'Modèle'}"
      :data="phoneModels"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="'phone-models-id-edit'"
      action-remove-confirm="Voulez-vous vraiment supprimer ce modèle de téléphone ?"
      @action-remove="deletePhoneModel"
    />
  </main>
</template>

<script>
import ecList from '~/components/crud/list.vue';

const FIELDS = [
  'id',
  'label',
];

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ $api }) {
    const { data, pagination } = await $api.phoneModels.getPhoneModels(FIELDS.join(','));
    return {
      phoneModels: data,
      pagination,
    };
  },
  methods: {
    async deletePhoneModel({ id }) {
      await this.$api.phoneModels.deletePhoneModel(id);
      const updatedList = await this.$api.phoneModels.getPhoneModels(FIELDS.join(','));
      this.phoneModels = updatedList.data;
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
