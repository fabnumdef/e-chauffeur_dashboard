<template>
  <div>
    <nuxt-child :user="user" />
  </div>
</template>

<script>
export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.isRegulator()) {
      throw new Error('Vous n\'avez pas les droits pour récupérer les informations d\'un utilisateur.');
    }
    const { data: user } = await $api.users
      .getUser(params.id, 'id,firstname,lastname,name,email,roles(role,campuses(id,name))');
    return {
      user,
    };
  },
};
</script>
