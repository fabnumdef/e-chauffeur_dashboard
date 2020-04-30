<template>
  <div>
    <ec-button
      is-rounded
      icon-left="file-import"
      icon-class="has-text-info"
      @click="toggleModal(true)"
    >
      Importer CSV
    </ec-button>
    <import-modal
      :display="displayModal"
      @toggle="toggleModal(false)"
      @submit="importCSV"
    />
  </div>
</template>

<script>
import importModal from '~/components/modals/import-csv.vue';

export default {
  components: {
    importModal,
  },
  props: {
  },
  data: () => ({
    displayModal: false,
  }),
  methods: {
    toggleModal(status = !this.displayModal) {
      this.displayModal = status;
    },
    importCSV(...args) {
      this.$emit('import', ...args);
    },
  },
};
</script>
