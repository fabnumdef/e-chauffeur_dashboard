<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Bases
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
      <vue-modal
        :active="csvStatus"
        @toggle-modal="toggleCsvModal(false)"
      >
        <template slot="title">
          Télécharger le CSV
        </template>
        <fieldset>
          <ec-field
            label="Délimiteur CSV"
            field-id="delimiter"
          >
            <input
              id="delimiter"
              v-model="csv.delimiter"
              type="text"
              class="input"
            >
          </ec-field>
          <ec-field
            label="Séparateur de champ CSV"
            field-id="separator"
          >
            <input
              id="separator"
              v-model="csv.separator"
              type="text"
              class="input"
            >
          </ec-field>
          <ec-field
            label="Mask de champs"
            field-id="mask"
          >
            <textarea
              id="mask"
              v-model="csv.mask"
              class="textarea"
            />
          </ec-field>
          <ec-field
            label="Ride flatten"
            field-id="flatten"
          >
            <label class="checkbox">
              <input
                v-model="csv.flatten"
                type="checkbox"
              >
              Oui
            </label>
          </ec-field>
        </fieldset>
        <hr>
        <ul>
          <li
            v-for="(row, i) in downloadLinks"
            :key="i"
          >
            <button
              class="button is-primary"
              @click="row"
            >
              Partie {{ i+1 }}
            </button>
          </li>
        </ul>
        <template slot="submit" />
      </vue-modal>
      <div class="options">
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="{name: 'campuses-new'}"
          class="button is-success"
        >
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'plus']" />
          </span>
          <span>Nouveau</span>
        </nuxt-link>
      </div>
    </header>
    <ec-list
      :columns="{id: 'ID', name: 'Nom'}"
      :data="campuses"
      :pagination-offset="pagination.offset"
      :pagination-total="pagination.total"
      :pagination-per-page="pagination.limit"
    >
      <template #actions="{ row }">
        <nuxt-link
          v-if="$auth.isSuperAdmin()"
          :to="{
            name: 'campuses-id-edit',
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
          @click="deleteCampus(row)"
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
import { DateTime } from 'luxon';
import ecList from '~/components/crud/list.vue';
import vueModal from '~/components/modal.vue';
import ecField from '~/components/form/field.vue';


const ROWS_PER_QUERY = 1000;

export default {
  watchQuery: ['offset', 'limit'],
  components: {
    ecList,
    ecField,
    vueModal,
  },
  async asyncData({ $api, query }) {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 30;
    const { data, pagination } = await $api.campuses.getCampuses('id,name', {}, offset, limit);
    return {
      campuses: data,
      pagination,
    };
  },
  data() {
    return {
      downloadLinks: [],
      pagination: {},
      csvStatus: false,
      csv: {},
      fields: ['*'],
    };
  },
  watch: {
    async pagination() {
      await this.recalcDownloadLinks();
    },
    'csv.separator': async function csvSeparator() {
      await this.recalcDownloadLinks();
    },
    'csv.delimiter': async function csvSeparator() {
      await this.recalcDownloadLinks();
    },
    'csv.flatten': async function csvSeparator() {
      await this.recalcDownloadLinks();
    },
    'csv.mask': async function csvSeparator() {
      await this.recalcDownloadLinks();
    },
  },
  async created() {
    this.csv = {
      separator: ';',
      delimiter: '"',
      flatten: true,
      mask: '*',
    };
  },
  methods: {
    async deleteCampus({ id }) {
      await this.$api.campuses.deleteCampus(id);
      const offset = parseInt(this.$route.query.offset, 10) || 0;
      const limit = parseInt(this.$route.query.limit, 10) || 30;
      const updatedList = await this.$api.campuses.getCampuses('id,name', {}, offset, limit);
      this.campuses = updatedList.data;
      this.pagination = updatedList.pagination;
    },
    async recalcDownloadLinks() {
      const { pagination: { total, limit }, csv } = this;
      this.downloadLinks = Array
        .from({ length: Math.ceil(total / limit) })
        .map((_, i) => async () => {
          const { data } = await this.$api
            .campuses.getCampuses(
              csv.mask || this.fields,
              {
                offset: ROWS_PER_QUERY * i,
                limit: ROWS_PER_QUERY,
                format: 'text/csv',
                csv,
              },
            );

          if (window && window.document && window.btoa) {
            const encodedUri = encodeURI(`data:text/csv;base64,${window.btoa(data)}`);
            const link = window.document
              .createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute(
              'download',
              `export_${this.getFormatDate(DateTime.local(), 'dd_MM_yyyy')}_part${i + 1}.csv`,
            );
            window.document.body.appendChild(link);
            link.click();
            link.remove();
          }
        });
    },
    toggleCsvModal(force) {
      this.csvStatus = force || !this.csvStatus;
    },
    getFormatDate(date, format) {
      return DateTime.fromISO(date).toFormat(format);
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
