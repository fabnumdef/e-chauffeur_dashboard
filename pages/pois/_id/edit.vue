<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Poi #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Poi
      </h1>
      <h2
        v-if="id"
        class="subtitle"
      >
        Edit
      </h2>
      <h2
        v-else
        class="subtitle"
      >
        New
      </h2>
    </header>
    <form @submit.prevent="edit(poi)">
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="poi.id"
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
          v-model="poi.label"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Coordonnées GPS"
        field-id="location"
      >
        <ec-gps-point
          id="location"
          v-model="poi.location"
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
        <span>Save</span>
      </button>

      <button
        v-else
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'plus']" />
        </span>
        <span>Create</span>
      </button>
    </form>
  </main>
</template>

<script>
import ecField from '~/components/form/field.vue';
import ecGpsPoint from '~/components/form/gps-point.vue';

export default {
  components: {
    ecField,
    ecGpsPoint,
  },
  props: {
    poi: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.poi.id };
  },
  methods: {
    async edit(poi) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.pois.patchPoi(this.id, poi, 'id,label,location(coordinates)')));
      } else {
        ({ data } = (await this.$api.pois.postPoi(poi, 'id,label,location(coordinates)')));
      }

      this.$router.push({
        name: 'pois-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
