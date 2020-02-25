<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Catégorie #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Catégorie
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
      @submit.prevent="edit(category)"
    >
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model.trim="category.id"
          :disabled="!!id"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Label"
        field-id="label"
      >
        <input
          id="label"
          v-model.trim="category.label"
          class="input"
        >
      </ec-field>

      <button
        v-if="id"
        type="submit"
        class="button is-primary"
        :class="loading && 'is-loading'"
        :disabled="loading"
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
        :class="loading && 'is-loading'"
        :disabled="loading"
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

export default {
  components: {
    ecField,
  },
  props: {
    category: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { loading: false, id: this.category.id };
  },
  methods: {
    async edit(category) {
      const ApiCategories = this.$api.categories('id,label');
      let data = {};
      try {
        this.toggleLoading();
        if (this.id) {
          ({ data } = (await ApiCategories.patchCategory(category.id, category)));
        } else {
          ({ data } = (await ApiCategories.postCategory(category)));
        }

        this.$toast.success('Donnée enregistrée avec succès');
        this.$router.push({
          name: 'categories-id-edit',
          params: { id: data.id },
        });
      } catch {
        this.$toast.error('Une erreur est survenue, merci de vérifier les champs.');
      }
      this.toggleLoading();
    },
    toggleLoading() {
      this.loading = !this.loading;
    },
  },
};
</script>
