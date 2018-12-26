<template>
  <div>
    <nuxt-child :category="category" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      category: (await $api.categories('id,label').getCategory(params.id)).data,
    };
  },
};
</script>
