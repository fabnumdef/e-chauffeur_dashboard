<template>
  <div>
    <nuxt-child :loop-pattern="loopPattern" />
  </div>
</template>

<script>
const EDITABLE_FIELDS = ['id', 'label', 'category', 'stops', 'comments', 'reachDuration'];

export default {
  async asyncData({ params, $api, store: { getters } }) {
    return {
      loopPattern: (await $api.loopPatterns(getters['context/campus'], EDITABLE_FIELDS.join(','))
        .getLoopPattern(params.id)).data,
    };
  },
};
</script>
