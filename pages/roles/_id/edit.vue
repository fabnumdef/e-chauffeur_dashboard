<template>
  <main>
    <header>
      <h1
        v-if="id"
        class="title"
      >
        Role #{{ id }}
      </h1>
      <h1
        v-else
        class="title"
      >
        Role
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
    <form @submit.prevent="edit(role)">
      <EcField
        label="ID"
        field-id="id"
      >
        <input
          id="id"
          v-model="role.id"
          :disabled="!!id"
          class="input"
        >
      </EcField>

      <EcField>
        <SearchRoles v-model="role.inherit" />
      </EcField>

      <EcField>
        <SearchRights v-model="role.rights" />
      </EcField>

      <EcField>
        <SearchCampuses v-model="role.campuses" />
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
        ({ data } = (await this.$api.roles.patchRole(role.id, role, 'id,inherit,rights,campuses')));
      } else {
        ({ data } = (await this.$api.roles.postRole(role, 'id,inherit,rights,campuses')));
      }

      this.$router.push({
        name: 'roles-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
