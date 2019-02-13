<template>
  <div>
    <nuxt-child :campus="campus" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = 'id,name,location,phone(drivers,everybody)';

export default {
  async asyncData({ params, $api }) {
    return {
      campus: (await $api.campuses.getCampus(params.id, EDITABLE_FIELDS)).data,
    };
  },
};
</script>
