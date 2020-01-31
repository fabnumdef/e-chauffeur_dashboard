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
      v-if="!minimized"
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
          v-if="minimizable"
          class="button is-text is-rounded"
          type="button"
          aria-label="close"
          @click="toggleMinimize(true)"
        >
          <fa-icon icon="window-minimize" />
        </button>
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
    <div
      v-else
      class="modal-minimized"
      @click="toggleMinimize(false)"
    >
      <slot name="title" /> <fa-icon
        class="is-pulled-right"
        icon="window-minimize"
      />
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
    withBackground: {
      type: Boolean,
      default: true,
    },
    minimizable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      minimized: false,
    };
  },
  methods: {
    toggleModal() {
      this.toggleMinimize(false);
      this.$emit('toggle-modal', !this.active);
    },
    toggleMinimize(v) {
      this.minimized = typeof v === 'undefined' ? !this.minimized : v;
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
  @keyframes highlight {
    0% {background-color: $primary;}
    50% {background-color: $danger;}
    100% {background-color: $primary;}
  }
  .modal-minimized {
    position: absolute;
    bottom: 0;
    right: $gap;
    background: $primary;
    color: $white;
    padding: $size-7;
    border-radius: $radius-small $radius-small 0 0;
    animation-name: highlight;
    animation-duration: 1s;
    /deep/ svg {
      margin-left: $size-7;
    }
  }
</style>
