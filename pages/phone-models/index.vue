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
    >
      <template
        v-if="$auth.isSuperAdmin()"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="{
            name: 'phone-models-id-edit',
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
          @click="deletePhoneModel(row)"
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

const FIELDS = [
  'id',
  'label',
];

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.phoneModels.getPhoneModels(FIELDS.join(','), {}, offset, limit);
    return {
      phoneModels: data,
      pagination,
    };
  },
  methods: {
    async deletePhoneModel({ id }) {
      await this.$api.phoneModels.deletePhoneModel(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.phoneModels.getPhoneModels(FIELDS.join(','), {}, offset, limit);
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
