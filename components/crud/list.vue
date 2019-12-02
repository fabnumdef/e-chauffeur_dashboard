<template>
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
          v-if="hasSlot('actions') || hasAction"
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
        <td v-else-if="hasAction">
          <nuxt-link
            v-if="!!actionEdit"
            :to="routeActionEdit(row)"
            class="button is-primary"
          >
            <span class="icon is-small">
              <fa-icon :icon="['fas', 'edit']" />
            </span>
            <span>Modifier</span>
          </nuxt-link>
          <button
            v-if="$listeners['action-remove']"
            class="button is-danger"
            @click="confirmRemove(row)"
          >
            <span class="icon is-small">
              <fa-icon :icon="['fas', 'trash']" />
            </span>
            <span>Supprimer</span>
          </button>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="data.length > 0">
      <tr>
        <td :colspan="columnNumber">
          <ec-pagination
            :total="paginationTotal"
            :offset="paginationOffset"
            :per-page="paginationPerPage"
          />
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import merge from 'lodash.merge';
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
    paginationTotal: {
      type: Number,
      default: 0,
    },
    paginationOffset: {
      type: Number,
      default: 0,
    },
    paginationPerPage: {
      type: Number,
      default: 100,
    },
    actionEdit: {
      type: [Object, String],
      default: null,
    },
    actionRemoveConfirm: {
      type: String,
      default: 'Voulez vous vraiment supprimer cette ligne ?',
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
    routeActionEdit() {
      return (row) => {
        if (!this.actionEdit) {
          return null;
        }
        let route = {};
        if (typeof this.actionEdit === 'string') {
          route = {
            name: this.actionEdit,
          };
        } else {
          route = this.actionEdit;
        }
        return merge({}, route, {
          params: { id: row.id },
        });
      };
    },
    hasAction() {
      return !!this.routeActionEdit || (this.$listeners && this.$listeners['action-remove']);
    },
  },
  methods: {
    confirmRemove(row) {
      // @todo: refactor to put modal and remove confirm
      // eslint-disable-next-line no-alert
      if (window && window.confirm && window.confirm(this.actionRemoveConfirm)) {
        this.$emit('action-remove', row);
      }
    },
    hasSlot(name) {
      return !!this.$slots[name] || !!this.$scopedSlots[name];
    },
    isIcon(string) {
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
  .actions {
    width: 250px;
  }

  svg.success {
    color: #23d160;
  }
  svg.error {
    color: #ff3860;
  }
</style>
