<template>
  <div>
    <nuxt-child :shuttle-factory="shuttleFactory" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = ['id', 'label', 'category', 'stops', 'comments', 'reachDuration'];

export default {
  async asyncData({ params, $api, store: { getters } }) {
    const { data: shuttleFactory } = await $api.shuttleFactories(getters['context/campus'], EDITABLE_FIELDS.join(','))
      .getShuttleFactory(params.id);
    return {
      shuttleFactory,
    };
  },
};
</script>
