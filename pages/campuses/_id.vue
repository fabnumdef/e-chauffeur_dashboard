<template>
  <div>
    <NuxtChild :campus="campus" />
  </div>
</template>

<script>

export default {
  async asyncData({ params, $api }) {
    return {
      campus: (await $api.campuses.getCampus(params.id, 'id,name')).data,
    };
  },
};
</script>
