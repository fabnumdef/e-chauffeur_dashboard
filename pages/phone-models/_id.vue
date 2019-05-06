<template>
  <div>
    <nuxt-child :phone-model="phoneModel" />
  </div>
</template>

<script>
export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.isAdmin()) {
      throw new Error('Vous n\'avez pas les droits pour récupérer les informations d\'un modèle de téléphone.');
    }
    return {
      phoneModel: (await $api.phoneModels.getPhoneModel(params.id, 'id,label')).data,
    };
  },
};
</script>
