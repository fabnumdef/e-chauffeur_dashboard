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
    <ec-field>
      <input class="input" type="file">
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
    emitSubmit(evt) {
      this.$emit('submit', evt);
    },
  },
};
</script>
