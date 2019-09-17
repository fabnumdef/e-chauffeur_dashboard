<template>
  <bulma-tile parent>
    <bulma-tile
      class="box"
    >
      <header class="title">
        <div
          v-if="Object.keys($slots).length > 1"
          class="is-pulled-right"
        >
          <template
            v-for="k of Object.keys(types)"
          >
            <button
              v-if="$slots[k]"
              :key="k"
              class="button is-text"
              :class="{'is-active': isSwitch(types[k])}"
              @click="switchTo(types[k])"
            >
              <fa-icon :icon="types[k]" />
            </button>
          </template>
        </div>
        {{ title }}
      </header>
      <template
        v-for="k of Object.keys(types)"
      >
        <div
          v-if="$slots[k] && isSwitch(types[k])"
          :key="k"
          class="content is-large"
        >
          <slot :name="k" />
        </div>
      </template>
    </bulma-tile>
  </bulma-tile>
</template>
<script>
import bulmaTile from '~/components/tile.vue';

const TEXT = 'list';
const MAP = 'map';
const PIE = 'chart-pie';
export const types = {
  TEXT, PIE, MAP,
};

export default {
  components: {
    bulmaTile,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    defaultFragment: {
      type: String,
      default: 'TEXT',
    },
  },
  data() {
    return {
      switch: types[this.defaultFragment],
    };
  },
  computed: {
    types() {
      return types;
    },

  },
  methods: {
    switchTo(v) {
      this.switch = v;
    },
    isSwitch(v) {
      return this.switch === v;
    },
  },
};
</script>
