<template>
  <vue-multiselect
    :id="id"
    :options="categories"
    :value="value"
    track-by="id"
    label="label"
    :searchable="false"
    :show-labels="false"
    placeholder="Choisir une catégorie"
    @input="onInput"
  />
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      campus: 'context/campus',
    }),
    categories() {
      return this.campus.categories || [];
    },
  },
  methods: {
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
