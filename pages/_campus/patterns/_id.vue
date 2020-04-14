<template>
  <div>
    <nuxt-child :pattern="pattern" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = ['id', 'label', 'category', 'stops', 'comments', 'reachDuration'];

export default {
  async asyncData({ params, $api, store: { getters } }) {
    const { data: pattern } = await $api.patterns(getters['context/campus'], EDITABLE_FIELDS.join(','))
      .getPattern(params.id);
    return {
      pattern,
    };
  },
};
</script>
