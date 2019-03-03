<template>
  <vue-multiselect
    :id="id"
    :placeholder="placeholder"
    :options="cars"
    :value="value"
    track-by="id"
    label="label"
    :show-labels="false"
    @search-change="updateSet"
    @input="onInput"
    @open="onOpen"
  >
    <template
      slot="option"
      slot-scope="{ option }"
    >
      <p
        v-if="option.model"
        class="is-size-7"
      >
        {{ option.model.label }}
      </p>
      <p>{{ option.label }} <span class="is-size-7">({{ option.id }})</span></p>
    </template>
  </vue-multiselect>
</template>
<script>
import debounce from 'lodash.debounce';

const FIELDS = 'id,label,model(id,label)';
export default {
  props: {
    campus: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: '',
    },
    start: {
      type: Object,
      default: null,
    },
    end: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    cars: [],
  }),
  methods: {
    updateSet: debounce(async function updateSet(search) {
      const { data } = await this.$api.rides(this.campus).getAvailableCars(
        FIELDS,
        this.start.toISO(),
        this.end.toISO(),
        { search },
      );
      this.cars = data;
    }, 500),
    async onOpen() {
      const { data } = await this.$api.rides(this.campus).getAvailableCars(
        FIELDS,
        this.start.toISO(),
        this.end.toISO(),
      );
      this.cars = data;
    },
    onInput(data) {
      this.$emit('input', data);
    },
  },
};
</script>
