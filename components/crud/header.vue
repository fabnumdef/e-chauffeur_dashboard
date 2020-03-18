<template>
  <header class="with-options">
    <h1 class="title">
      {{ title }}
    </h1>
    <div class="options">
      <button
        v-if="importCsv"
        class="button is-rounded"
        type="button"
        @click="toggleUploadModal"
      >
        <fa-icon
          :icon="['fas', 'file-import']"
          class="has-text-info"
        />
        Importer CSV
      </button>
      <button
        v-if="exportCsv"
        class="button is-rounded"
        type="button"
        @click="toggleExportModal"
      >
        <fa-icon
          :icon="['fas', 'file-export']"
          class="has-text-info"
        />
        Exporter CSV
      </button>
      <nuxt-link
        v-if="canCreateNew && toCreateNew"
        :to="toCreateNew"
        class="button is-success"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'plus']" />
        </span>
        <span>Créer</span>
      </nuxt-link>
    </div>
    <import-modal
      v-if="importCsv"
      :display="displayUploadModal"
      @toggle="toggleUploadModal"
      @submit="importCSV"
    />
    <export-modal
      v-if="exportCsv"
      :display="displayExportModal"
      :pagination="pagination"
      :api-call="apiCall"
      :has-mask="hasMask"
      :mask="mask"
      :display-aside="importCsv"
      @toggleModal="toggleExportModal"
    />
  </header>
</template>

<script>
import importModal from '~/components/modals/import-csv.vue';
import exportModal from '~/components/modals/export-csv.vue';

export default {
  components: {
    importModal,
    exportModal,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    toCreateNew: {
      type: Object,
      default: () => null,
    },
    canCreateNew: {
      type: Boolean,
      default() {
        return this.$auth.isSuperAdmin();
      },
    },
    importCsv: {
      type: Boolean,
      default: false,
    },
    exportCsv: {
      type: Boolean,
      default: false,
    },
    apiCall: {
      type: Function,
      default: () => null,
    },
    mask: {
      type: String,
      default: 'id',
    },
    pagination: {
      type: Object,
      default: () => null,
    },
    hasMask: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      displayUploadModal: false,
      displayExportModal: false,
    };
  },
  methods: {
    toggleUploadModal() {
      this.displayUploadModal = !this.displayUploadModal;
    },
    importCSV(...args) {
      this.$emit('importCSV', ...args);
    },
    toggleExportModal() {
      this.displayExportModal = !this.displayExportModal;
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
    * {
      margin: 0 .3em;
    }
  }
}
</style>
