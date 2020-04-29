<template>
  <vue-modal
    :active="display"
    @toggle-modal="toggle(false)"
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
        label="Masque de champs"
        field-id="mask"
      >
        <p>Ce masque par défaut génèrera un tableau compatible avec l'import de données.</p>
        <textarea
          id="mask"
          v-model="mask"
          class="textarea"
        />
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
</template>

<script>
import generateCsvLink from '~/helpers/generate-csv-link';
import vueModal from '~/components/modals/default.vue';

const ROWS_PER_QUERY = 1000;

export default {
  components: {
    vueModal,
  },
  props: {
    pagination: {
      type: Object,
      required: true,
    },
    display: {
      type: Boolean,
      required: true,
    },
    exportQuery: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      downloadLinks: [],
      csv: {
        separator: ';',
        delimiter: '"',
      },
      mask: this.exportQuery.getMask(),
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
  },
  mounted() {
    this.recalcDownloadLinks();
  },
  methods: {
    async recalcDownloadLinks() {
      const { pagination: { total }, csv } = this;

      // @todo: Double check pagination logic
      this.downloadLinks = Array
        .from({ length: Math.ceil(total / ROWS_PER_QUERY) })
        .map((_, i) => async () => {
          const { data } = await this.exportQuery
            .setMask(this.mask)
            .list()
            .setOffset(ROWS_PER_QUERY * i)
            .setLimit(ROWS_PER_QUERY)
            .toCSV(csv);
          generateCsvLink(data, i + 1);
        });
    },
    toggle(force) {
      this.$emit('toggleModal', force);
    },
  },
};
</script>
