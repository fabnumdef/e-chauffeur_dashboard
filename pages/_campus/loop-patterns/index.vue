<template>
  <main>
    <crud-header
      title="Modèle de boucle"
      :to-create-new="campusLink('loop-patterns-new')"
      :can-create-new="$auth.isRegulator(campus.id) || $auth.isSuperAdmin()"
      import-csv
      export-csv
      :mask="mask"
      has-mask
      :pagination="pagination"
      :api-call="$api.loopPatterns(campus.id, mask).getLoopPatterns"
      @importCSV="importCSV"
    />
    <crud-filter
      :field-value="fieldFilter"
      :content-value="contentFilter"
      :fields-header="[
        { id: 'id', label: 'Id'},
        { id: 'label', label: 'Label' },
        { id: 'category', label: 'Catégorie'},
      ]"
      :field-content="fieldContent"
      @updateFieldFilter="updateFieldFilter"
      @updateContentFilter="updateContentFilter"
      @reset="reset"
    />
    <crud-list
      :columns="columns"
      :data="filteredData"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
      :action-edit="campusLink('loop-patterns-id-edit')"
      action-remove-confirm="Voulez vous vraiment supprimer ce modèle de boucles ?"
      @action-remove="deleteLoopPattern"
    >
      <template
        v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)"
        #actions="{ row }"
      >
        <nuxt-link
          v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)"
          :to="campusLink('loop-patterns-id-edit', {
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
          v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)"
          class="button is-danger"
          @click="deleteLoopPattern(row)"
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
import { mapGetters } from 'vuex';
import crudList from '~/components/crud/list.vue';
import crudHeader from '~/components/crud/header.vue';
import crudFilter from '~/components/crud/filter.vue';
import handleFilters from '~/components/crud/mixins/handle-filters';

const columns = {
  id: 'ID',
  label: 'Label',
  category: 'Catégorie',
  comments: 'Commentaires',
  stops: 'Arrêts',
};

export default {
  components: {
    crudHeader,
    crudFilter,
    crudList,
  },
  mixins: [handleFilters],
  async asyncData({ params, $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api
      .loopPatterns({ id: params.campus }, Object.keys(columns).join(','))
      .getLoopPatterns({ offset, limit });
    return {
      data,
      pagination,
    };
  },
  data() {
    return {
      mask: 'id',
    };
  },
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
    loopPatternsAPI() {
      return this.$api.loopPatterns(this.campus, Object.keys(columns).join(','));
    },
    dataToDisplay() {
      return this.data.map((item) => {
        const newItem = { ...item };
        if (item.category) {
          newItem.category = item.category.label;
        }
        if (item.stops) {
          newItem.stops = item.stops.length > 0 ? item.stops.length : 'Pas d\'arrêts définis';
        }

        return newItem;
      });
    },
    filteredData() {
      return this.contentFilter
        ? this.dataToDisplay.filter((user) => user[this.fieldFilter.id] === this.contentFilter)
        : this.dataToDisplay;
    },
  },
  methods: {
    async deleteLoopPattern({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer ce modèle de boucle ?')) {
        await this.loopPatternsAPI.deleteLoopPattern(id);
        this.updateList();
      }
    },
    async importCSV({ data, params }) {
      try {
        await this.loopPatternsAPI.postLoopPattern(data, params);
        this.$toast.success('Import réalisé avec succès');
      } catch (err) {
        this.$toast.error("Un problème est survenu pendant l'import");
      }
      this.updateList();
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.loopPatternsAPI.getLoopPatterns({ offset, limit });
      this.data = updatedList.data;
      this.pagination = updatedList.pagination;
    },
  },
};
</script>
