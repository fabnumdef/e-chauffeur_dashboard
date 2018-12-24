<template>
  <div
    class="modal"
    :class="{
      'is-active': active
    }"
  >
    <div
      class="modal-background"
      @click="toggleModal"
    />
    <div class="modal-card">
      <header
        v-if="$slots.title"
        class="modal-card-head"
      >
        <p class="modal-card-title">
          <slot name="title" />
        </p>
        <button
          class="button is-text is-rounded"
          aria-label="close"
          @click="toggleModal"
        >
          <fa-icon icon="times" />
        </button>
      </header>
      <form @submit.prevent="modalSubmit">
        <section class="modal-card-body">
          <slot />
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            type="submit"
          >
            Save changes
          </button>
          <button
            class="button"
            type="button"
            @click="toggleModal"
          >
            Cancel
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    toggleModal() {
      this.$emit('toggle-modal', !this.active);
    },
    modalSubmit(...rest) {
      this.$emit('submit', ...rest);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "~assets/css/head";
  @import "~bulma/sass/components/modal.sass";
</style>
