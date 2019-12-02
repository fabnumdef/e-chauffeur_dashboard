<template>
  <vue-modal
    :active="csvStatus"
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
</template>

<script>
import generateCsvLink from '~/helpers/generateCsvLink';
import vueModal from '~/components/modal';
import ecField from '~/components/form/field';

const ROWS_PER_QUERY = 1000;

export default {
  components: {
    vueModal,
    ecField,
  },
  props: {
    pagination: {
      type: Object,
      required: true,
    },
    csvStatus: {
      type: Boolean,
      required: true,
    },
    apiCall: {
      type: Function,
      required: true,
    },
    hasMask: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      downloadLinks: [],
      csv: {},
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
      this.$emit('updateMask', this.csv.mask);
      await this.recalcDownloadLinks();
    },
  },
  async created() {
    this.csv = {
      separator: ';',
      delimiter: '"',
      flatten: true,
      mask: this.mask,
    };
  },
  methods: {
    async recalcDownloadLinks() {
      const { pagination: { total }, csv } = this;

      this.downloadLinks = Array
        .from({ length: Math.ceil(total / ROWS_PER_QUERY) })
        .map((_, i) => async () => {
          const args = [
            csv.mask,
            {
              offset: ROWS_PER_QUERY * i,
              limit: ROWS_PER_QUERY,
              format: 'text/csv',
              csv,
            },
          ];
          if (this.hasMask) {
            args.shift();
          }
          const { data } = await this.apiCall(...args);
          generateCsvLink(data, i + 1);
        });
    },
    toggle(force) {
      this.$emit('toggleModal', force);
    },
    emitUpdateMask(mask) {
      this.$emit('updateMask', mask);
    },
  },
};
</script>
