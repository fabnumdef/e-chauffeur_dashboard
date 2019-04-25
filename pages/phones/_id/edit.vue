<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Téléphone <em class="is-size-6">#{{ phone.id }} : {{ phone.model }}</em>
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
          v-model="phone.id"
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
          v-model="phone.imei"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Modèle"
        field-id="model"
      >
        <input
          id="model"
          v-model="phone.model"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="N° de téléphone"
        field-id="phone"
      >
        <input
          id="phone"
          v-model="phone.phone"
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
          v-model="phone.comments"
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
import ecField from '~/components/form/field.vue';
import ecSearchPhoneStates from '~/components/form/search-phone-states.vue';

const EDITABLE_FIELDS = ['*'];

export default {
  components: {
    ecField,
    ecSearchPhoneStates,
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

  methods: {
    async edit(phone) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.phones.patchPhone(phone.id, phone, EDITABLE_FIELDS.join(','))));
      } else {
        ({ data } = (await this.$api.phones.postPhone(phone, EDITABLE_FIELDS.join(','))));
      }

      this.$router.push({
        name: 'phones-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
