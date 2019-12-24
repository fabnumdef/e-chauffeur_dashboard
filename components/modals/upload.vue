<template>
  <ecModal
    :active="display"
    :with-background="true"
    @toggle-modal="toggle"
    @submit="emitSubmit"
  >
    <template #title>
      Importer un fichier CSV
    </template>
    <ec-field
      id="file"
      label="Veuillez sélectionner un fichier :"
    >
      <input
        class="input"
        name="csv-file"
        type="file"
      >
    </ec-field>
    <template #submit>
      <button
        type="submit"
        class="button is-success"
      >
        Importer
      </button>
    </template>
  </ecModal>
</template>

<script>
import ecModal from '~/components/modal.vue';
import ecField from '~/components/form/field.vue';

export default {
  components: {
    ecModal,
    ecField,
  },
  props: {
    display: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle');
    },
    emitSubmit({ target }) {
      const formData = new FormData();
      const [file] = target.querySelector('input').files;
      if (file.name.split('.').pop() !== 'csv') {
        this.$toast.error("Le format du fichier n'est pas valide");
        return;
      }
      formData.append('csv', file);

      this.$emit('submit', formData);
    },
  },
};
</script>
