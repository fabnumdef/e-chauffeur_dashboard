<template>
  <table class="table is-fullwidth is-striped is-bordered">
    <thead>
      <tr>
        <th
          v-for="label in columnLabels"
          :key="label"
        >
          {{ label }}
        </th>
        <th v-if="hasAction">
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
          {{ row[key] }}
        </td>
        <td v-if="hasAction">
          <NuxtLink
            v-if="!!actionEdit"
            :to="routeActionEdit(row)"
            class="button is-primary"
          >
            <span class="icon is-small">
              <FaIcon :icon="['fas', 'edit']" />
            </span>
            <span>Edit</span>
          </NuxtLink>
          <button
            v-if="$listeners['action-remove']"
            class="button is-danger"
            @click="confirmRemove(row)"
          >
            <span class="icon is-small">
              <FaIcon :icon="['fas', 'trash']" />
            </span>
            <span>Remove</span>
          </button>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="data.length > 0">
      <tr>
        <td :colspan="columnNumber">
          <EcPagination
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
      default: 'Do you really want to remove this row ?',
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
        return merge(route, {
          params: { id: row.id },
        });
      };
    },
    hasAction() {
      return this.routeActionEdit || (this.$listeners && this.$listeners['action-remove']);
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
  },
};
</script>
