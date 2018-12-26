<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Category #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Category
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
    <form @submit.prevent="edit(category)">
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="category.id"
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
          v-model="category.label"
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
import searchRoles from '~/components/form/search-roles.vue';

export default {
  components: {
    ecField,
    searchRoles,
  },
  props: {
    category: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.category.id };
  },
  methods: {
    async edit(category) {
      const ApiCategories = this.$api.categories('id,label');
      let data = {};
      if (this.id) {
        ({ data } = (await ApiCategories.patchCategory(category.id, category)));
      } else {
        ({ data } = (await ApiCategories.postCategory(category)));
      }

      this.$router.push({
        name: 'categories-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
