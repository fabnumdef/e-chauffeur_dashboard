<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Base #{{ id }} : {{ campus.name }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Base
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
        Nouveau
      </h2>
    </header>
    <form
      class="box"
      @submit.prevent="edit(campus)"
    >
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="campus.id"
          :disabled="!!id"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Nom"
        field-id="name"
      >
        <input
          id="name"
          v-model="campus.name"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Numéro de téléphone (chauffeurs)"
        field-id="phone-drivers"
      >
        <input
          id="phone-drivers"
          v-model="campus.phone.drivers"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Numéro de téléphone (public)"
        field-id="phone-everybody"
      >
        <input
          id="phone-everybody"
          v-model="campus.phone.everybody"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Catégories"
        field-id="categories"
      >
        <search-categories v-model="campus.categories" />
      </ec-field>
      <ec-field
        label="Coordonnées GPS"
        field-id="location"
      >
        <ec-gps-point
          id="location"
          v-model="campus.location"
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
        <span>Modifier</span>
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
import ecGpsPoint from '~/components/form/gps-point.vue';
import searchCategories from '~/components/form/search-categories.vue';

const EDITABLE_FIELDS = 'id,name,location,phone(drivers,everybody),categories(id,label)';
export default {
  components: {
    ecField,
    ecGpsPoint,
    searchCategories,
  },
  props: {
    campus: {
      type: Object,
      default: () => ({ phone: {}, categories: [] }),
    },
  },
  data() {
    return { id: this.campus.id };
  },
  methods: {
    async edit(campus) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.campuses.patchCampus(campus.id, campus, EDITABLE_FIELDS)));
      } else {
        ({ data } = (await this.$api.campuses.postCampus(campus, EDITABLE_FIELDS)));
      }

      this.$router.push({
        name: 'campuses-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
