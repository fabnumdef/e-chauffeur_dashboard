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
      >
        <p>
          Si vous rencontrez la moindre difficulté ou souhaitez nous partager une
          idée d’amélioration du service e-Chauffeur, n’hésitez pas à remplir le formulaire ci-dessous.
          Nous tâcherons de revenir vers vous dans les plus brefs délais.
        </p>
        <div class="field">
          <label class="label">Votre type de retour</label>
          <div class="control">
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
          </div>
        </div>
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
  watchQuery: ['offset'],
  components: {
    ecField,
  },
  data: () => ({
    type: 'Amélioration',
    message: '',
  }),
  methods: {
    async deleteUser({ id }) {
      await this.$api.users.deleteUser(id);
      const updatedList = await this.$api.users.getUsers('id,email');
      this.users = updatedList.data;
      this.pagination = updatedList.pagination;
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
