<template>
  <main>
    <header>
      <h1
        v-if="campus.id"
        class="title">Campus #{{ campus.id }} : {{ campus.name }}</h1>
      <h1
        v-else
        class="title">Campus</h1>
      <h2
        v-if="campus.id"
        class="subtitle">Edit</h2>
      <h2
        v-else
        class="subtitle">New</h2>
    </header>
    <form @submit.prevent="edit(campus)">
      <ec-field
        label="Name"
        field-id="name">
        <input
          id="name"
          v-model="campus.name"
          class="input" >
      </ec-field>

      <button
        v-if="campus.id"
        type="submit"
        class="button is-primary">
        <span class="icon is-small">
          <fa-icon :icon="['fas', 'save']" />
        </span>
        <span>Save</span>
      </button>

      <button
        v-else
        type="submit"
        class="button is-primary">
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

export default {
  components: {
    ecField,
  },
  props: {
    campus: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    async edit(campus) {
      let data = {};
      if (campus.id) {
        ({ data } = (await this.$api.campuses.patchCampus(campus.id, campus, 'id,name')));
      } else {
        ({ data } = (await this.$api.campuses.postCampus(campus, 'id,name')));
      }

      this.$router.push({
        name: 'campuses-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
