<template>
  <main>
    <header>
      <h1
        v-if="user.id"
        class="title"
      >
        User #{{ user.id }} : {{ user.email }}
      </h1>
      <h1
        v-else
        class="title"
      >
        User
      </h1>
      <h2
        v-if="user.id"
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
    <form @submit.prevent="edit(user)">
      <ec-field
        label="Name"
        field-id="name"
      >
        <input
          id="name"
          v-model="user.name"
          class="input"
        >
      </ec-field>
      <ec-field
        label="Email"
        field-id="email"
      >
        <input
          id="email"
          v-model="user.email"
          class="input"
        >
      </ec-field>

      <ec-field
        label="Password"
        field-id="password"
      >
        <input
          id="password"
          v-model="user.password"
          type="password"
          class="input"
        >
      </ec-field>

      <ec-field>
        <search-roles v-model="user.roles" />
      </ec-field>

      <button
        v-if="user.id"
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
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    async edit(user) {
      let data = {};
      if (user.id) {
        ({ data } = (await this.$api.users.patchUser(user.id, user, 'id,name,email,roles(id)')));
      } else {
        ({ data } = (await this.$api.users.postUser(user, 'id,name,email,roles(id)')));
      }

      this.$router.push({
        name: 'users-id-edit',
        params: { id: data.id },
      });
    },
  },
};
</script>
