<template>
  <div>
    <nuxt-child :driver="driver" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = ['id', 'email', 'password', 'name'];

export default {
  async asyncData({ params, $api, store: { getters } }) {
    return {
      driver: (await $api.drivers(getters['context/campus'].id, EDITABLE_FIELDS.join(',')).getDriver(params.id)).data,
    };
  },
};
</script>
