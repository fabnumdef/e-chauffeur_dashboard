<template>
  <main>
    <crud-header
      title="Modèles de téléphone"
      :to-create-new="{name: 'phone-models-new'}"
      import-csv
      export-csv
      :mask="mask"
      :pagination="pagination"
      :api-call="$api.phoneModels.getPhoneModels"
      @importCSV="importCSV"
    />
    <crud-filter
      :field-value="fieldFilter"
      :content-value="contentFilter"
      :fields-header="[
        { id: 'id', label: 'Id'},
        { id: 'label', label: 'Label'}
      ]"
      :field-content="fieldContent"
      @updateFieldFilter="updateFieldFilter"
      @updateContentFilter="updateContentFilter"
      @reset="reset"
    />
    <crud-list
      :columns="{id: 'ID', label: 'Modèle'}"
      :data="filteredData"
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
    </crud-list>
  </main>
</template>

<script>
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';
import crudFilter from '~/components/crud/filter.vue';
import handleFilters from '~/components/crud/mixins/handle-filters';

const FIELDS = [
  'id',
  'label',
];

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    crudList,
    crudHeader,
    crudFilter,
  },
  mixins: [handleFilters],
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.phoneModels.getPhoneModels(FIELDS.join(','), { offset, limit });
    return {
      data,
      pagination,
    };
  },
  data() {
    return {
      mask: 'id,label',
    };
  },
  methods: {
    async deletePhoneModel({ id }) {
      await this.$api.phoneModels.deletePhoneModel(id);
      this.updateList();
    },
    async importCSV({ data, params }) {
      try {
        await this.$api.phoneModels.postPhoneModels(data, params);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.phoneModels.getPhoneModels(FIELDS.join(','), { offset, limit });
      this.data = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>
