<template>
  <div>
    <nuxt-child :campus="campus" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      campus: (await $api.campuses.getCampus(params.id, 'id,name,location')).data,
    };
  },
};
</script>
