<template>
  <main>
    <header class="with-options">
      <h1 class="title">
        Contactez-nous
      </h1>
    </header>
    <div>
      <form
        class="box"
        @submit.prevent="sendFeedback"
      >
        <ec-field>
          <p>
            Si vous rencontrez la moindre difficulté ou souhaitez nous partager une
            idée d’amélioration du service e-Chauffeur, n’hésitez pas à remplir le formulaire ci-dessous.
            Nous tâcherons de revenir vers vous dans les plus brefs délais.
          </p>
        </ec-field>
        <ec-field label="Votre type de retour">
          <label class="radio">
            <input
              v-model="type"
              value="Amélioration"
              type="radio"
              name="type"
            >
            Amélioration
          </label>
          <label class="radio">
            <input
              v-model="type"
              value="Bug"
              type="radio"
              name="type"
            >
            Bug
          </label>
          <label class="radio">
            <input
              v-model="type"
              value="Question"
              type="radio"
              name="type"
            >
            Question
          </label>
        </ec-field>
        <ec-field
          label="Votre message"
          field-id="commentary"
        >
          <textarea
            id="commentary"
            v-model="message"
            class="textarea"
            placeholder="Tapez votre message"
          />
        </ec-field>

        <button
          type="submit"
          class="button is-primary"
        >
          <span>Envoyer mon message</span>
          <span class="icon is-small">
            <fa-icon :icon="['fas', 'arrow-right']" />
          </span>
        </button>
      </form>
    </div>
  </main>
</template>

<script>
import ecField from '~/components/form/field.vue';

export default {
  components: {
    ecField,
  },
  data: () => ({
    type: 'Amélioration',
    message: '',
  }),
  methods: {
    async sendFeedback() {
      await this.$api.feedback.postFeedback(this.message, this.type);
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
  }
</style>
