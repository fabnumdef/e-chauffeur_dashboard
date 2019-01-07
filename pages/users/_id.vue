<template>
  <div>
    <nuxt-child :user="user" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      user: (await $api.users.getUser(params.id, 'id,name,email,roles(id),workingHours')).data,
    };
  },
};
</script>
