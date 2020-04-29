<template>
  <section>
    <header class="intro">
      <slot name="intro" />
    </header>
    <table class="table is-fullwidth is-striped is-bordered is-hoverable">
      <thead>
        <tr>
          <th
            v-for="label in columnLabels"
            :key="label"
          >
            {{ label }}
          </th>
          <th
            v-if="hasSlot('actions')"
            class="actions"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in data"
          :key="row[id]"
        >
          <td
            v-for="key in columnKeys"
            :key="key"
          >
            <span v-if="isIcon(row[key])">
              <fa-icon
                :class="getIcon(row[key]).type"
                :icon="[getIcon(row[key]).pre, getIcon(row[key]).name]"
              />
            </span>
            <span v-else>
              {{ row[key] }}
            </span>
          </td>
          <td v-if="hasSlot('actions')">
            <slot
              name="actions"
              :row="row"
            />
          </td>
        </tr>
      </tbody>
      <tfoot v-if="data.length > 0">
        <tr>
          <td :colspan="columnNumber">
            <ec-pagination
              :total="pagination.total"
              :offset="pagination.offset"
              :per-page="pagination.limit"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </section>
</template>

<script>
import ecPagination from '../pagination.vue';

export default {
  components: {
    ecPagination,
  },
  props: {
    id: {
      type: String,
      default: () => 'id',
    },
    columns: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array,
      default: () => ([]),
    },
    pagination: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    columnNumber() {
      return this.columnKeys.length + 1;
    },
    columnLabels() {
      return Object.values(this.columns);
    },
    columnKeys() {
      return Object.keys(this.columns);
    },
  },
  methods: {
    hasSlot(name) {
      return !!this.$slots[name] || !!this.$scopedSlots[name];
    },
    isIcon(string) {
      if (typeof string !== 'string') {
        return false;
      }
      const [isIcon] = string.split(':');
      return isIcon === 'fas';
    },
    getIcon(icon) {
      const [pre, name, type] = icon.split(':');
      return {
        pre,
        name,
        type,
      };
    },
  },
};
</script>
<style scoped lang="scss">
  @import "~assets/css/head";
  .actions {
    width: 250px;
  }
  svg.success {
    color: #23d160;
  }
  svg.error {
    color: #ff3860;
  }
  .intro {
    margin: $size-small 0;
  }
</style>
