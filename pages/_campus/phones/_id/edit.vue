<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Téléphone <em class="is-size-6">#{{ phone.id }}</em>
      </h1>
      <h1
        v-else
        class="title"
      >
        Téléphone
      </h1>
      <h2
        v-if="id"
        class="subtitle"
      >
        Modification
      </h2>
      <h2
        v-else
        class="subtitle"
      >
        Création
      </h2>
    </header>
    <form
      class="box"
      @submit.prevent="edit(phone)"
    >
      <ec-field
        label="S/N"
        field-id="id"
      >
        <input
          id="id"
          v-model.trim="phone.id"
          :disabled="!!id"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="IMEI"
        field-id="imei"
      >
        <input
          id="imei"
          v-model.trim="phone.imei"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Modèle"
        field-id="model"
      >
        <ec-search-phone-models
          id="model"
          v-model="phone.model"
        />
      </ec-field>
      <ec-field
        label="N° de téléphone"
        field-id="number"
      >
        <input
          id="number"
          v-model.trim="phone.number"
          type="tel"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Etat"
        field-id="state"
      >
        <ec-search-phone-states
          id="state"
          v-model="phone.state"
        />
      </ec-field>
      <ec-field
        label="Commentaires"
        field-id="comments"
      >
        <textarea
          id="comments"
          v-model.trim="phone.comments"
          class="textarea"
        />
      </ec-field>

      <button
        v-if="id"
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'save']" />
        </span>
        <span>Sauvegarder</span>
      </button>

      <button
        v-else
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'plus']" />
        </span>
        <span>Créer</span>
      </button>
    </form>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import ecField from '~/components/form/field.vue';
import ecSearchPhoneStates from '~/components/form/search-phone-states.vue';
import ecSearchPhoneModels from '~/components/form/search-phone-models.vue';

const EDITABLE_FIELDS = [
  'id',
  'imei',
  'number',
  'model',
  'campus',
  'state',
  'comments',
];

export default {
  components: {
    ecField,
    ecSearchPhoneStates,
    ecSearchPhoneModels,
  },
  props: {
    phone: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.phone.id };
  },

  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    PhonesAPI() {
      return this.$api.phones(this.campus, EDITABLE_FIELDS.join(','));
    },
  },

  methods: {
    async edit(phone) {
      let data = {};
      try {
        if (this.id) {
          ({ data } = (await this.PhonesAPI.patchPhone(phone.id, phone)));
        } else {
          ({ data } = (await this.PhonesAPI.postPhone(phone)));
        }
        this.$toast.success('Donnée sauvegardée avec succès');
        this.$router.push(this.$context.buildCampusLink('phones-id-edit', {
          params: { id: data.id },
        }));
      } catch ({ response: { status } }) {
        if (status === 400) {
          this.$toast.error('Erreur de création ou de mise à jour, merci de vérifier tous les champs');
        } else {
          this.$toast.error('Erreur serveur, si le problème persiste, veuillez contacter le service technique');
        }
      }
    },
  },
};
</script>
