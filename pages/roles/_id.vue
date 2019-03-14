<template>
  <div>
    <nuxt-child :role="role" />
  </div>
</template>

<script>

export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.hasRight('canGetRole')) {
      throw new Error('Vous n\'avez pas les droits pour récupérer les informations d\'un rôle.');
    }
    return {
      role: (await $api.roles.getRole(params.id, 'id,inherit(id),rights,campuses')).data,
    };
  },
};
</script>
