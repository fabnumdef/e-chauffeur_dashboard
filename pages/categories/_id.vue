<template>
  <div>
    <nuxt-child :category="category" />
  </div>
</template>

<script>

export default {
  async asyncData({ app, params, $api }) {
    if (!app.$auth.hasRight('canGetCategory')) {
      throw new Error('Vous d\'avez pas les droits pour récupérer les informations d\'une catégorie.');
    }
    return {
      category: (await $api.categories('id,label').getCategory(params.id)).data,
    };
  },
};
</script>
