<template>
  <div>
    <ec-button
      is-rounded
      icon-left="file-export"
      icon-class="has-text-info"
      @click="toggleModal(true)"
    >
      Exporter CSV
    </ec-button>
    <export-modal
      :display="displayModal"
      :pagination="pagination"
      :export-query="exportQuery"
      @toggleModal="toggleModal(false)"
    />
  </div>
</template>

<script>
import exportModal from '~/components/modals/export-csv.vue';

export default {
  components: {
    exportModal,
  },
  props: {
    pagination: {
      type: Object,
      default: () => null,
    },
    exportQuery: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      displayModal: false,
    };
  },
  methods: {
    toggleModal(status = !this.displayModal) {
      this.displayModal = status;
    },
  },
};
</script>
<style lang="scss" scoped>
  @import "~assets/css/head";
  div {
    display: inline-block;
    margin: 0 10px;
  }
</style>
