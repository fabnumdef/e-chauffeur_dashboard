<template>
  <main>
    <crud-header
      title="Trajets de navette"
      :to-create-new="campusLink('patterns-new')"
      :can-create-new="$auth.isRegulator(campus.id) || $auth.isSuperAdmin()"
      :pagination="pagination"
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
      :action-edit="campusLink('patterns-id-edit')"
      action-remove-confirm="Voulez-vous vraiment supprimer ce trajet ?"
      @action-remove="deletePattern"
    >
      <template
        v-if="$auth.isSuperAdmin() || $auth.isRegulator(campus.id)"
        #actions="{ row }"
      >
        <nuxt-link
          :to="campusLink('patterns-id-edit', {
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
          class="button is-danger"
          @click="deletePattern(row)"
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
  reachDuration: 'Temps moyen entre arrêts',
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
      .patterns(params.campus, Object.keys(columns).join(','))
      .getPatterns({ offset, limit });

    return {
      data,
      pagination,
    };
  },
  computed: {
    columns: () => columns,
    ...mapGetters({
      campus: 'context/campus',
    }),
    apiCall() {
      return this.$api.patterns(this.campus, Object.keys(columns).join(','));
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
        ? this.dataToDisplay.filter((data) => data[this.fieldFilter.id] === this.contentFilter)
        : this.dataToDisplay;
    },
  },
  methods: {
    async deletePattern({ id }) {
      if (window && window.confirm && window.confirm('Voulez-vous vraiment supprimer ce modèle de boucle ?')) {
        await this.apiCall.deletePattern(id);
        await this.updateList();
      }
    },
    async updateList() {
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;

      const { data, pagination } = await this.apiCall.getPatterns({ offset, limit });
      this.data = data;
      this.pagination = pagination;
    },
  },
};
</script>
