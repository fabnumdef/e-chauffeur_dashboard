<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="pois"
    :value="value"
    track-by="id"
    label="label"
    :show-labels="false"
    @search-change="updateSet"
    @input="onInput"
    @open="onOpen"
  >
    <template
      slot="singleLabel"
      slot-scope="{ option }"
    >
      <p class="is-size-7">
        {{ option.id }}
      </p>
      <p>
        {{ option.label }}
      </p>
    </template>
    <template
      slot="option"
      slot-scope="{ option }"
    >
      <p class="is-size-7">
        {{ option.id }}
      </p>
      <p>
        {{ option.label }}
      </p>
    </template>
  </vue-multiselect>
</template>
<script>
import debounce from 'lodash.debounce';

const FIELDS = 'id,label';
export default {
  props: {
    placeholder: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: '',
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    pois: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.pois.getPois(FIELDS, { search });
      this.pois = data;
    }, 500),
    onInput(data) {
      this.$emit('input', data);
    },
    async onOpen() {
      const { data } = await this.$api.pois.getPois(FIELDS);
      this.pois = data;
    },
  },
};
</script>
