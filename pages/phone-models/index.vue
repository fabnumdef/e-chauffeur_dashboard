<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Modèles de téléphones
      </h1>
      <button
        class="button is-rounded"
        type="button"
        @click="toggleCsvModal(true)"
      >
        <fa-icon
          :icon="['fas', 'file-export']"
          class="has-text-info"
        />
        Exporter CSV
      </button>
      <csv-modal
        :csv-status="displayModal"
        :pagination="pagination"
        :api-call="$api.phoneModels.getPhoneModels"
        @toggleModal="toggleCsvModal"
        :mask="mask"
      />
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
import csvModal from '~/components/csv-modal';

const FIELDS = [
  'id',
  'label',
];

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    csvModal,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.phoneModels.getPhoneModels(FIELDS.join(','), { offset, limit });
    return {
      phoneModels: data,
      pagination,
    };
  },
  data() {
    return {
      displayModal: false,
      mask: 'id,label',
    };
  },
  methods: {
    async deletePhoneModel({ id }) {
      await this.$api.phoneModels.deletePhoneModel(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.phoneModels.getPhoneModels(FIELDS.join(','), { offset, limit });
      this.phoneModels = updatedList.data;
      this.pagination = updatedList.pagination;
    },
    toggleCsvModal(force) {
      this.displayModal = force || !this.displayModal;
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
