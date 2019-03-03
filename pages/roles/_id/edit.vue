<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Rôle #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Rôle
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
      @submit.prevent="edit(role)"
    >
      <ec-field
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="role.id"
          :disabled="!!id"
          class="input"
        >
      </ec-field>

      <ec-field label="Rôles hérités">
        <search-roles v-model="role.inherit" />
      </ec-field>

      <ec-field label="Droits">
        <search-rights v-model="role.rights" />
      </ec-field>

      <ec-field label="Bases liées">
        <search-campuses v-model="role.campuses" />
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
import searchRights from '~/components/form/search-rights.vue';
import searchRoles from '~/components/form/search-roles.vue';
import searchCampuses from '~/components/form/search-campuses.vue';

export default {
  components: {
    ecField,
    searchRights,
    searchCampuses,
    searchRoles,
  },
  props: {
    role: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return { id: this.role.id };
  },
  methods: {
    async edit(role) {
      let data = {};
      if (this.id) {
        ({ data } = (await this.$api.roles.patchRole(role.id, role, 'id,inherit(id),rights,campuses')));
      } else {
        ({ data } = (await this.$api.roles.postRole(role, 'id,inherit(id),rights,campuses')));
      }

      this.$router.push({
        name: 'roles-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
