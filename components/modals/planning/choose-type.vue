<template>
  <modal
    :active="active"
    :with-background="false"
    @toggle-modal="toggleModal"
  >
    <template #title>
      Choisissez un type de creneau
    </template>
    <div class="button-container">
      <button
        type="button"
        class="button is-success"
        @click="chooseType"
      >
        Configurer un creneau
      </button>
      <button
        type="button"
        class="button is-primary"
        @click="chooseType('shuttle')"
      >
        Configurer une navette
      </button>
    </div>
  </modal>
</template>

<script>
import modal from '~/components/modals/default.vue';

export default {
  components: {
    modal,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    chooseType(val) {
      this.$emit('choose-type', val);
      this.toggleModal();
    },
    toggleModal() {
      this.$emit('toggle-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
  .button-container {
    width: 100%;
    text-align: center;
  }
</style>
