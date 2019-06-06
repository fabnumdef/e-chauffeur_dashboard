<template>
  <div>
    <nuxt-child :phone="phone" />
  </div>
</template>

<script>
export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.isAdmin()) {
      throw new Error('Vous n\'avez pas les droits pour récupérer les informations d\'un téléphone.');
    }
    return {
      phone: (await $api.phones.getPhone(params.id, 'id,imei,number,model,owner,campus,state,comments')).data,
    };
  },
};
</script>
