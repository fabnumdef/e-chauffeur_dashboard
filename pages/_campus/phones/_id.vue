<template>
  <div>
    <nuxt-child :phone="phone" />
  </div>
</template>

<script>
export default {
  async asyncData({
    app, params, $api, store: { getters },
  }) {
    if (!app.$auth.isRegulator()) {
      throw new Error('Vous n\'avez pas les droits pour récupérer les informations d\'un téléphone.');
    }
    return {
      phone: (await $api.phones(getters['context/campus'], 'id,imei,number,model,owner,campus,state,comments')
        .getPhone(params.id)).data,
    };
  },
};
</script>
