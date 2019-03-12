<template>
  <div>
    <nuxt-child :user="user" />
  </div>
</template>

<script>

export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.hasRight('canGetUser')) {
      throw new Error('Vous n\'avez pas les droits pour récupérer les informations d\'un utilisateur.');
    }
    return {
      user: Object.assign(
        { workingHours: '' },
        (await $api.users.getUser(params.id, 'id,name,email,roles(id),workingHours')).data,
      ),
    };
  },
};
</script>
