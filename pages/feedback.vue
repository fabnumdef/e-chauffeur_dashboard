<template>
  <form
    class="box"
    @submit.prevent="sendFeedback"
  >
    <p>
      Si vous rencontrez la moindre difficulté ou souhaitez nous partager une
      idée d’amélioration du service e-Chauffeur, n’hésitez pas à remplir le formulaire ci-dessous.
      Nous tâcherons de revenir vers vous dans les plus brefs délais.
    </p>
    <ec-field
      label="Votre type de retour"
      :error-message="getErrorMessage('type')"
    >
      <ec-choice
        v-model="data.type"
        expanded
        :choices="['Amélioration', 'Bug', 'Question']"
      />
    </ec-field>
    <ec-field
      label="Votre message"
      field-id="message"
      :error-message="getErrorMessage('message')"
    >
      <textarea
        id="message"
        v-model.trim="data.message"
        class="textarea"
        :class="getErrorClass('message')"
        placeholder="Tapez votre message"
      />
    </ec-field>
    <ec-button
      type="submit"
      is-primary
      :loading="loading"
      icon-right="arrow-right"
    >
      Envoyer mon message
    </ec-button>
  </form>
</template>

<script>
import toggleLoadingMixin from '~/helpers/mixins/toggle-loading';
import resetableMixin from '~/helpers/mixins/reset-data';
import errorsManagementMixin from '~/helpers/mixins/errors-management';
import titleMixin from '~/helpers/mixins/page-title';

export default {
  mixins: [
    toggleLoadingMixin(),
    errorsManagementMixin(),
    titleMixin('Contactez-nous'),
    resetableMixin(() => ({
      data: {
        type: 'Amélioration',
        message: '',
      },
    })),
  ],
  methods: {
    async sendFeedback() {
      return this.raceToggleLoading(() => this.handleCommonErrorsBehavior(async () => {
        await this.$api.query('feedback').send(this.data);
        this.$toast.success('Message envoyé.');
        this.reset();
      }));
    },
  },
};
</script>
