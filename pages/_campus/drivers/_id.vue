<template>
  <div>
    <nuxt-child :driver="driver" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = ['id', 'email', 'password', 'name', 'firstname', 'lastname'];

export default {
  async asyncData({ params, $api }) {
    return {
      driver: (await $api.drivers(params.campus, EDITABLE_FIELDS.join(',')).getDriver(params.id)).data,
    };
  },
};
</script>
