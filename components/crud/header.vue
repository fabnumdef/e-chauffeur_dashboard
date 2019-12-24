<template>
  <header class="with-options">
    <h1 class="title">
      {{ title }}
    </h1>
    <div class="options">
      <button
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
      <nuxt-link
        v-if="$auth.isSuperAdmin()"
        :to="toCreateNew"
        class="button is-success"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'plus']" />
        </span>
        <span>Créer</span>
      </nuxt-link>
    </div>
    <upload-modal
      :display="displayUploadModal"
      @toggle="toggleUploadModal"
      @submit="uploadCSV"
    />
  </header>
</template>

<script>
import uploadModal from '~/components/modals/upload.vue';

export default {
  components: {
    uploadModal,
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
  },
  data() {
    return {
      displayUploadModal: false,
    };
  },
  methods: {
    toggleUploadModal() {
      this.displayUploadModal = !this.displayUploadModal;
    },
    uploadCSV(data) {
      this.$emit('uploadCSV', data);
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
