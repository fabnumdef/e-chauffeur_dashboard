<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Modèle de téléphone <em class="is-size-6">#{{ phoneModel.id }}</em>
      </h1>
      <h1
        v-else
        class="title"
      >
        Modèle de téléphone
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
      @submit.prevent="edit(phoneModel)"
    >
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="phoneModel.id"
          :disabled="!!id"
          type="text"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Label"
        field-id="label"
      >
        <input
          id="label"
          v-model="phoneModel.label"
          type="text"
          class="input"
        >
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

const EDITABLE_FIELDS = [
  'id',
  'label',
];

export default {
  components: {
    ecField,
  },
  props: {
    phoneModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.phoneModel.id };
  },

  methods: {
    async edit(phoneModel) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.phoneModels.patchPhoneModel(
          phoneModel.id,
          phoneModel,
          EDITABLE_FIELDS.join(','),
        )));
      } else {
        ({ data } = (await this.$api.phoneModels.postPhoneModel(phoneModel, EDITABLE_FIELDS.join(','))));
      }

      this.$router.push({
        name: 'phone-models-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
