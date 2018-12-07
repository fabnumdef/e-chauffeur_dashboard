<template>
  <div>
    <NuxtChild :role="role" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      role: (await $api.roles.getRole(params.id, 'id,inherit,rights,campuses')).data,
    };
  },
};
</script>
