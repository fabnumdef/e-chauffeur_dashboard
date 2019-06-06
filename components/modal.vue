<template>
  <div
    class="modal"
    :class="{
      'is-active': active
    }"
  >
    <div
      v-if="withBackground"
      class="modal-background"
      @click="toggleModal"
    />
    <form
      class="modal-card"
      @submit.prevent="modalSubmit"
    >
      <header
        v-if="$slots.title"
        class="modal-card-head"
      >
        <p class="modal-card-title">
          <slot name="title" />
        </p>
        <button
          class="button is-text is-rounded"
          type="button"
          aria-label="close"
          @click="toggleModal"
        >
          <fa-icon icon="times" />
        </button>
      </header>
      <section class="modal-card-body">
        <slot />
      </section>
      <footer
        v-if="$slots.submit"
        class="modal-card-foot"
      >
        <slot name="submit">
          <button
            class="button is-success"
            type="submit"
          >
            Sauvegarder
          </button>
          <button
            class="button"
            type="button"
            @click="toggleModal"
          >
            Annuler
          </button>
        </slot>
      </footer>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    withBackground: {
      type: Boolean,
      default: true,
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
  $modal-card-body-background-color: $white;
  @import "~bulma/sass/components/modal.sass";

  .modal-card {
    box-shadow: 15px 15px 30px 0  rgba($black, 0.3);
    &-title {
      color: findColorInvert($modal-card-head-background-color);
    }
    &-head button, &-head button:hover {
      color: findColorInvert($modal-card-head-background-color);
    }
  }
</style>
