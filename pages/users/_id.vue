<template>
  <div>
    <NuxtChild :user="user" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      user: (await $api.users.getUser(params.id, 'id,email')).data,
    };
  },
};
</script>
