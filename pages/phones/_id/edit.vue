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
          v-model="phone.id"
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
          v-model="phone.imei"
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
          v-model="phone.number"
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
        label="Assigné à"
      >
        <div class="columns">
          <ec-field
            class="column is-size-7"
            label="Choix de la base"
          >
            <ec-search-user-campus
              id="campus"
              v-model="phone.campus"
            />
          </ec-field>
          <ec-field
            class="column is-size-7"
            label="Choix du chauffeur"
          >
            <ec-search-campus-drivers
              id="owner"
              v-model="phone.owner"
              :campus="phone.campus"
            />
          </ec-field>
        </div>
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
import ecSearchPhoneModels from '~/components/form/search-phone-models.vue';
import ecSearchCampusDrivers from '~/components/form/search-campus-drivers.vue';
import ecSearchUserCampus from '~/components/form/search-user-campus.vue';


const EDITABLE_FIELDS = [
  'id',
  'imei',
  'number',
  'model',
  'owner',
  'campus',
  'state',
  'comments',
];

export default {
  components: {
    ecField,
    ecSearchPhoneStates,
    ecSearchCampusDrivers,
    ecSearchPhoneModels,
    ecSearchUserCampus,
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
