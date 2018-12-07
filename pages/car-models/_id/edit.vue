<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        CarModel #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        CarModel
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
    <form @submit.prevent="edit(carModel)">
      <EcField
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="carModel.id"
          :disabled="!!id"
          class="input"
        >
      </EcField>

      <EcField
        label="Label"
        field-id="label"
      >
        <input
          id="label"
          v-model="carModel.label"
          class="input"
        >
      </EcField>

      <button
        v-if="id"
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <FaIcon :icon="['fas', 'save']" />
        </span>
        <span>Save</span>
      </button>

      <button
        v-else
        type="submit"
        class="button is-primary"
      >
        <span class="icon is-small">
          <FaIcon :icon="['fas', 'plus']" />
        </span>
        <span>Create</span>
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
    carModel: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.carModel.id };
  },
  methods: {
    async edit(carModel) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.carModels.patchCarModel(this.id, carModel, 'id,label')));
      } else {
        ({ data } = (await this.$api.carModels.postCarModel(carModel, 'id,label')));
      }

      this.$router.push({
        name: 'car-models-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
