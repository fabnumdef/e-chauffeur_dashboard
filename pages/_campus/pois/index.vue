<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Lieux
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
        :api-call="$api.pois(campus.id, mask).getPois"
        :has-mask="true"
        :mask="mask"
        @toggleModal="toggleCsvModal"
        @updateMask="updateMask"
      />
      <div class="options">
        <nuxt-link
          :to="campusLink('pois-new')"
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
      :columns="columns"
      :data="pois"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template #actions="{ row }">
        <nuxt-link
          v-if="$auth.isAdmin()"
          :to="campusLink('pois-id-edit', {
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
          v-if="$auth.isAdmin()"
          class="button is-danger"
          @click="deletePoi(row)"
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
import csvModal from '~/components/csv-modal';

const columns = { id: 'ID', label: 'Label', enabled: 'Activé' };

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    csvModal,
  },
  async asyncData({ $api, query, params }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.pois(
      { id: params.campus },
      Object.keys(columns).join(','),
      { withDisabled: true },
    ).getPois({ offset, limit });
    return {
      pois: data,
      pagination,
    };
  },
  data() {
    return {
      displayModal: false,
      mask: 'id,label,location(coordinates),campus(name),enabled',
    };
  },
  computed: {
    columns() { return columns; },
    ...mapGetters({
      campus: 'context/campus',
    }),
  },
  methods: {
    async deletePoi({ id }) {
      if (window && window.confirm && window.confirm('Voulez vous vraiment supprimer ce lieu ?')) {
        await this.$api.pois(this.campus).deletePoi(id);
        const offset = parseInt(this.$route.query.offset, 10) || 0;
        const limit = parseInt(this.$route.query.limit, 10) || 30;
        const updatedList = await this.$api.pois(this.campus, Object.keys(columns).join(','), { withDisabled: true })
          .getPois({ offset, limit });
        this.pois = updatedList.data;
        this.pagination = updatedList.pagination;
      }
    },
    toggleCsvModal(force) {
      this.displayModal = force || !this.displayModal;
    },
    updateMask(mask) {
      this.mask = mask;
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
