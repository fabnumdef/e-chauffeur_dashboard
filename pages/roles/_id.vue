<template>
  <div>
    <nuxt-child :role="role"/>
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      role: (await $api.roles.getRole(params.id, 'id,email')).data,
    };
  },
};
</script>
